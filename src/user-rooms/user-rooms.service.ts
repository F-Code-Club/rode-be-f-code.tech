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

  async findAllUsersInRoom(roomId: string) {
    this.logger.log(`Get all users in room ${roomId}`);
    const isExisted = await this.roomsService.isExisted(roomId);
    if (!isExisted) {
      return [null, 'Room not existed!'];
    }
    this.logger.log('Room is existed!');

    const users = await this.userRoomsRepository.find({
      where: {
        room: {
          id: roomId,
        },
        account: {
          role: RoleEnum.USER,
        },
      },
      relations: {
        account: true,
      },
      select: {
        account: {
          id: true,
          fname: true,
          lname: true,
          email: true,
          studentId: true,
          phone: true,
          dob: true,
        },
        joinTime: true,
        finishTime: true,
        attendance: true,
      },
    });
    return [users, null];
  }

  async findAllRoomsOfUser(account: Account) {
    this.logger.log(`Get all rooms that user ${account.email} joined`);
    const users = await this.userRoomsRepository.find({
      where: {
        account: {
          id: account.id,
          role: RoleEnum.USER,
        },
      },
      relations: {
        room: true,
      },
      select: {
        room: {
          id: true,
          openTime: true,
          closeTime: true,
          duration: true,
          type: true,
        },
        joinTime: true,
        finishTime: true,
      },
    });
    return users;
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
}
