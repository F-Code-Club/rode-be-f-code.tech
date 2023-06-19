import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubmitHistory } from './entities/submit-history.entity';
import { Room } from '@rooms/entities/room.entity';
import { Log } from '@logger/logger.decorator';
import { LogService } from '@logger/logger.service';
import { SubmitTimesDto } from './dtos/submit-times';
import { Account } from '@accounts/entities/account.entity';
import { Question } from '@rooms/entities/question.entity';
import {
  paginate,
  IPaginationOptions,
  paginateRawAndEntities,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class SubmitHistoryService {
  constructor(
    @Log('SubmitHistoryService') private readonly logger: LogService,

    @InjectRepository(SubmitHistory)
    private readonly submitHistoryRepository: Repository<SubmitHistory>,

    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,

    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,

    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  async getByQuestion(questionId: string, query: IPaginationOptions) {
    const question = await this.questionRepository.findOne({
      where: {
        id: questionId,
      },
    });
    if (!question) return [null, 'Question not exist'];
    const queryBuilder = await this.submitHistoryRepository
      .createQueryBuilder('submitHistory')
      .innerJoinAndSelect(
        (subQuery) => {
          return subQuery
            .select('lastSubmit.account', 'account')
            .addSelect('MAX(lastSubmit.submittedAt)', 'submittedAt')
            .addSelect('lastSubmit.link', 'link')
            .from(SubmitHistory, 'lastSubmit')
            .where('lastSubmit.question.id = :id')
            .setParameter('id', questionId)
            .groupBy('lastSubmit.account');
        },
        'lastSubmits',
        'lastSubmits.account = submitHistory.account AND lastSubmits.submittedAt = submitHistory.submittedAt',
      )
      .innerJoin('submitHistory.account', 'account')
      .addSelect([
        'account.id',
        'account.fname',
        'account.lname',
        'account.email',
        'account.studentId',
      ])
      .andWhere('account.isActive = true')
      .orderBy({
        'submitHistory.score': 'DESC',
        'submitHistory.time': 'ASC',
        'submitHistory.space': 'ASC',
      });
    query.limit = query.limit != null ? query.limit : 10;
    query.page = query.page != null ? query.page : 1;
    const result = await paginate(queryBuilder, query);
    return [result, null];
  }

  async getByRoom(roomId: string, query: IPaginationOptions) {
    const room = await this.roomRepository.findOne({
      where: {
        id: roomId,
      },
    });
    if (!room) return [null, 'Room not exist'];
    const queryBuilder = this.submitHistoryRepository
      .createQueryBuilder('submitHistory')
      .select(['submitHistory.id'])
      .addSelect('SUM(submitHistory.score)', 'totalScore')
      .addSelect('SUM(submitHistory.time)', 'totalTime')
      .addSelect('SUM(submitHistory.space)', 'totalSpace')
      .innerJoinAndSelect(
        (subQuery) => {
          return subQuery
            .addSelect('lastSubmit.account', 'account')
            .addSelect('lastSubmit.question', 'question')
            .addSelect('MAX(lastSubmit.submittedAt)', 'submittedAt')
            .from(SubmitHistory, 'lastSubmit')
            .innerJoin('lastSubmit.question', 'question')
            .innerJoin('question.room', 'room')
            .where('room.id = :roomId', { roomId: roomId })
            .groupBy('lastSubmit.account.id')
            .addGroupBy('lastSubmit.question.id');
        },
        'lastSubmits',
        'lastSubmits.account = submitHistory.account AND lastSubmits.question = submitHistory.question AND lastSubmits.submittedAt = submitHistory.submittedAt',
      )
      .innerJoin('submitHistory.account', 'account')
      .addSelect([
        'account.id',
        'account.fname',
        'account.lname',
        'account.email',
        'account.studentId',
      ])
      .innerJoin('account.userRooms', 'userRoom')
      .where('userRoom.room = :roomId', { roomId: roomId })
      .addSelect('userRoom.finishTime', 'finishTime')
      .andWhere('account.isActive = true')
      .groupBy('submitHistory.account')
      .orderBy({
        totalScore: 'DESC',
        totalTime: 'ASC',
        totalSpace: 'ASC',
      });
    query.limit = query.limit != null ? query.limit : 10;
    query.page = query.page != null ? query.page : 1;
    const [entityResult, rawResult] = await paginateRawAndEntities(
      queryBuilder,
      query,
    );
    const itemslength: number = entityResult.items.length;
    for (let i = 0; i < itemslength; i++) {
      delete entityResult.items[i].account.userRooms;
      delete entityResult.items[i].id;
      entityResult.items[i].account['fullname'] =
        rawResult[i]['account_lname'] + ' ' + rawResult[i]['account_fname'];
      entityResult.items[i]['totalScore'] = Number(rawResult[i]['totalScore']);
      entityResult.items[i]['totalTime'] = Number(rawResult[i]['totalTime']);
      entityResult.items[i]['totalSpace'] = Number(rawResult[i]['totalSpace']);
      entityResult.items[i]['finishTime'] = rawResult[i]['finishTime'];
      delete entityResult.items[i].account.fname;
      delete entityResult.items[i].account.lname;
    }
    return [entityResult, null];
  }
  async createSubmit(submission: SubmitHistory): Promise<void> {
    this.logger.log('<createSubmit> accountId: ' + submission.account.id);
    this.logger.log('<createSubmit> questionId: ' + submission.question.id);
    await this.submitHistoryRepository.save(submission);
  }
  async countNumberOfSubmissions(accountId: string, questionId: string) {
    this.logger.log(
      'countNumberOfSubmissions: ' + accountId + ', ' + questionId,
    );
    const count = await this.submitHistoryRepository.count({
      where: {
        account: {
          id: accountId,
          isActive: true,
        },
        question: {
          id: questionId,
        },
      },
    });
    this.logger.log('countNumberOfSubmissions: ' + count);
    return count;
  }
  async showUserHistory(userId: string, roomId?: string, questionId?: string) {
    let submits: SubmitHistory[] = [];
    const findCondition = {
      relations: ['question'],
      select: {
        id: true,
        score: true,
        time: true,
        space: true,
        submissions: true,
        submittedAt: true,
        language: true,
        question: { id: true },
      },
    };
    if (roomId) {
      const room = await this.roomRepository.findOne({
        where: {
          id: roomId,
        },
      });
      if (!room) return [null, 'Room not exist'];
      submits = await this.submitHistoryRepository.find({
        ...findCondition,
        where: {
          account: { id: userId },
          question: { room: { id: roomId } },
        },
        order: {
          submittedAt: 'DESC', // can not push order submittedAt into findCondition because it is error
        },
      });
    } else {
      const question = await this.questionRepository.findOne({
        where: {
          id: questionId,
        },
      });
      if (!question) return [null, 'Question not exist'];
      submits = await this.submitHistoryRepository.find({
        ...findCondition,
        where: {
          account: { id: userId },
          question: { id: questionId },
        },
        order: {
          submittedAt: 'DESC',
        },
      });
    }
    return [submits, null];
  }
}
