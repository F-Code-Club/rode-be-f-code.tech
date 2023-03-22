import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubmitHistory } from './entities/submit-history.entity';
import { Room } from '@rooms/entities/room.entity';
import { Account } from '@accounts/entities/account.entity';
import { Question } from '@rooms/entities/question.entity';
import { FilterOperator, PaginateQuery, paginate } from 'nestjs-paginate';
import { Log } from '@logger/logger.decorator';
import { LogService } from '@logger/logger.service';
@Injectable()
export class SubmitHistoryService {
  constructor(
    @Log('SubmitHistoryService')
    private readonly logger: LogService,

    @InjectRepository(SubmitHistory)
    private readonly submitHistoryRepository: Repository<SubmitHistory>,

    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,

    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,

    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  async paginateGetByQuestion(questionId: string, query: PaginateQuery) {
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
      .andWhere('account.isActive = true');
    const result = await paginate(query, queryBuilder, {
      sortableColumns: [
        'account.id',
        'account.fname',
        'account.lname',
        'account.email',
        'account.studentId',
        'score',
        'time',
        'space',
        'submittedAt',
      ],
      defaultSortBy: [
        ['score', 'DESC'],
        ['time', 'ASC'],
        ['space', 'ASC'],
      ],
      searchableColumns: [
        'account.id',
        'account.fname',
        'account.lname',
        'account.email',
        'account.studentId',
        'submittedAt',
      ],
      filterableColumns: {
        submittedAt: [
          FilterOperator.GTE,
          FilterOperator.LTE,
          FilterOperator.BTW,
        ],
      },
      relativePath: true,
    });
    return [result, null];
  }

  async getByQuestion(question: string) {
    const err = [];
    const submitHistory = await this.submitHistoryRepository
      .createQueryBuilder('submitHistory')
      .innerJoinAndSelect(
        (subQuery) => {
          return subQuery
            .select('lastSubmit.account', 'account')
            .addSelect('MAX(lastSubmit.submittedAt)', 'submittedAt')
            .from(SubmitHistory, 'lastSubmit')
            .where('lastSubmit.question.id = :id')
            .setParameter('id', question)
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
      })
      .getMany();

    if (!submitHistory.length) {
      err.push({
        at: 'question',
        message: 'can not find question',
      });
      return [null, err];
    }
    return [submitHistory, err];
  }

  async paginateGetByRoom(roomId: string, query: PaginateQuery) {
    const room = await this.roomRepository.findOne({
      where: {
        id: roomId,
      },
    });
    if (!room) return [null, 'Room not exist'];
    const queryBuilder = this.submitHistoryRepository
      .createQueryBuilder('submitHistory')
      .select('submitHistory.id')
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
      .groupBy('submitHistory.account.id');
    const result = await paginate(query, queryBuilder, {
      sortableColumns: [
        'account.id',
        'account.fname',
        'account.lname',
        'account.email',
        'account.studentId',
        'totalScore',
        'totalTime',
        'totalSpace',
      ],
      defaultSortBy: [
        ['totalScore', 'DESC'],
        ['totalSpace', 'ASC'],
        ['totalTime', 'ASC'],
      ],
      searchableColumns: [
        'account.id',
        'account.fname',
        'account.lname',
        'account.email',
        'account.studentId',
      ],
      filterableColumns: {
        finishTime: [
          FilterOperator.GTE,
          FilterOperator.LTE,
          FilterOperator.BTW,
        ],
      },
      relativePath: true,
    });
    return [result, null];
  }

  async getByRoom(roomId: string) {
    const room = await this.roomRepository.findOne({
      where: {
        id: roomId,
      },
    });
    if (!room) return [null, 'Room not exist'];
    const query = this.submitHistoryRepository
      .createQueryBuilder('submitHistory')
      .select('submitHistory.id')
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
      .groupBy('submitHistory.account.id')
      .orderBy({
        totalScore: 'DESC',
        totalTime: 'ASC',
        totalSpace: 'ASC',
      });
    const getMany: any = await query.getMany();
    // const getRawMany = await query.getRawMany();
    // let i = 0;
    // const submits = getMany.map((item) => {
    //   delete item.account.userRooms;
    //   item.totalScore = getRawMany[i].totalScore;
    //   item.totalTime = getRawMany[i].totalTime;
    //   item.totalSpace = getRawMany[i].totalSpace;
    //   item.finishTime = getRawMany[i].finishTime;
    //   i++;
    //   return item;
    // });
    return [getMany, null];
  }
  async createSubmit(submission: SubmitHistory) {
    //Handle number of submission here

    const submit = await this.submitHistoryRepository.save(submission);
    return [submit, null];
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
