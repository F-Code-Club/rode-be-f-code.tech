import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '@accounts/entities/account.entity';
import { RoleEnum } from '@etc/enums';
import { Repository } from 'typeorm';
import { UserRoom } from './entities/user-room.entity';
import { Log } from '@logger/logger.decorator';
import { LogService } from '@logger/logger.service';
import { JoinRoomDto } from './dtos/join-room.dto';
import { RoomsService } from '@rooms/rooms.service';
import { FilterOperator, PaginateQuery, paginate } from 'nestjs-paginate';

@Injectable()
export class UserRoomsService {
  constructor(
    @Log('UserRoomsService') private readonly logger: LogService,
    @InjectRepository(UserRoom)
    private readonly userRoomsRepository: Repository<UserRoom>,
    private readonly roomsService: RoomsService,
  ) {}

  async isUserHadJoined(roomId: string, accountId: string) {
    const userRoom = await this.userRoomsRepository.findOne({
      where: {
        room: {
          id: roomId,
        },
        account: {
          id: accountId,
          role: RoleEnum.USER,
        },
      },
    });
    return userRoom ? true : false;
  }

  async join(joinRoomDto: JoinRoomDto, account: Account) {
    this.logger.log(
      `User ${account.email} is joining room ${joinRoomDto.roomId}`,
    );
    const [room, error] = await this.roomsService.findOneById(
      joinRoomDto.roomId,
    );
    if (error) {
      return [null, 'Room not correct!'];
    }
    this.logger.log(`Room ${joinRoomDto.roomId} has been found`);

    this.logger.log('Check if user already joined room');
    const isJoined = await this.isUserHadJoined(room.id, account.id);
    if (isJoined) {
      return [null, 'You already joined this room!'];
    }

    this.logger.log('Check if private room: user must enter code to join');
    if (room.isPrivate && room.code !== joinRoomDto.code) {
      return [null, 'Room Number or Code not correct!'];
    }

    this.logger.log('Check if room is opened and then join');
    if (room.openTime < new Date() && room.closeTime > new Date()) {
      const userRoom = await this.userRoomsRepository.save({
        account,
        room,
      });
      return [userRoom.id, null];
    } else return [null, 'Room is not opened!'];
  }

  async findAllUsersInRoom(roomId: string, query: PaginateQuery) {
    this.logger.log(`Get all users in room ${roomId}`);
    const isExisted = await this.roomsService.isExisted(roomId);
    if (!isExisted) {
      return [null, 'Room not existed!'];
    }
    this.logger.log('Room is existed!');

    const queryBuilder = this.userRoomsRepository
      .createQueryBuilder('userRoom')
      .innerJoinAndSelect('userRoom.account', 'account')
      .where('userRoom.roomId = :roomId', { roomId })
      .andWhere('account.role = :role', { role: RoleEnum.USER })
      .select([
        'userRoom.id',
        'userRoom.joinTime',
        'userRoom.finishTime',
        'userRoom.attendance',
      ]);
    const result = await paginate(query, queryBuilder, {
      relations: ['account'],
      sortableColumns: ['joinTime', 'account.studentId'],
      defaultSortBy: [['joinTime', 'ASC']],
      searchableColumns: [
        'account.studentId',
        'account.email',
        'account.lname',
        'account.fname',
        'account.phone',
        'attendance',
      ],
      filterableColumns: {
        attendance: [FilterOperator.EQ],
        joinTime: [FilterOperator.GTE, FilterOperator.LTE, FilterOperator.BTW],
      },
      relativePath: true,
    });
    return [result, null];
  }

  async findAllRoomsOfUser(accountId: string, query: PaginateQuery) {
    this.logger.log(`Get all rooms that user ${accountId} joined`);
    const queryBuilder = this.userRoomsRepository
      .createQueryBuilder('userRoom')
      .innerJoinAndSelect('userRoom.room', 'room')
      .innerJoin('userRoom.account', 'account')
      .where('userRoom.accountId = :accountId', { accountId: accountId })
      .andWhere('account.role = :role', { role: RoleEnum.USER })
      .select([
        'userRoom.id',
        'userRoom.joinTime',
        'userRoom.finishTime',
        'room.id',
        'room.openTime',
        'room.closeTime',
        'room.duration',
        'room.type',
        'room.isPrivate',
      ]);
    const result = await paginate(query, queryBuilder, {
      relations: ['room'],
      sortableColumns: [
        'joinTime',
        'room.openTime',
        'room.closeTime',
        'room.type',
        'room.isPrivate',
      ],
      defaultSortBy: [['joinTime', 'ASC']],
      searchableColumns: [
        'joinTime',
        'room.openTime',
        'room.closeTime',
        'room.type',
        'room.isPrivate',
      ],
      filterableColumns: {
        'room.type': [FilterOperator.EQ],
        'room.isPrivate': [FilterOperator.EQ],
        joinTime: [FilterOperator.GTE, FilterOperator.LTE, FilterOperator.BTW],
        finishTime: [
          FilterOperator.GTE,
          FilterOperator.LTE,
          FilterOperator.BTW,
        ],
      },
    });
    return result;
  }

  async checkAttendance(id: string) {
    const check = await this.userRoomsRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!check) {
      return [null, 'Account not found'];
    }
    check.attendance = !check.attendance;
    await this.userRoomsRepository.save(check);
    return [check, null];
  }

  async finish(id: string) {
    const userRoom = await this.userRoomsRepository.findOne({
      relations: {
        room: true,
      },
      where: {
        id: id,
      },
    });
    if (!userRoom) {
      return [null, 'user-room not found'];
    }

    userRoom.finishTime = new Date();
    var t =
      (userRoom.finishTime.getTime() - userRoom.joinTime.getTime()) / 1000;
    t /= 60;
    var diff = Math.abs(Math.round(t));
    if (userRoom.room.isPrivate && diff > userRoom.room.duration) {
      return [null, 'finish time is invalid'];
    }
    await this.userRoomsRepository.save(userRoom);
    return [userRoom.finishTime, null];
  }
}
