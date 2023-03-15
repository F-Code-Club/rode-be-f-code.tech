import { Account } from '@accounts/entities/account.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubmitHistory } from './entities/submit-history.entity';
import { Room } from '@rooms/entities/room.entity';
import { Question } from '@rooms/entities/question.entity';

@Injectable()
export class SubmitHistoryService {
  constructor(
    @InjectRepository(SubmitHistory)
    private readonly submitHistoryRepository: Repository<SubmitHistory>,

    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,

    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,

    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

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
      .innerJoinAndSelect('submitHistory.account', 'account')
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
    const getRawMany = await query.getRawMany();
    let i = 0;
    const submits = getMany.map((item) => {
      delete item.account.userRooms;
      item.totalScore = getRawMany[i].totalScore;
      item.totalTime = getRawMany[i].totalTime;
      item.totalSpace = getRawMany[i].totalSpace;
      item.finishTime = getRawMany[i].finishTime;
      i++;
      return item;
    });
    return [submits, null];
  }
}
