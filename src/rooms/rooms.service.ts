import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomTypeEnum } from '@etc/enums';
import { Repository } from 'typeorm';
import { CreateRoomDto } from './dtos/create-room.dto';
import { Room } from './entities/room.entity';
import { UpdateRoomDto } from './dtos/update-room.dto';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { QuestionService } from '@questions/questions.service';
import { error } from 'console';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    private readonly questionService: QuestionService,
  ) {}

  async getAllRoomTypes() {
    const roomTypes = Object.values(RoomTypeEnum);
    return [roomTypes, null];
  }

  async paginationGetAllForUser(query: PaginateQuery) {
    return [
      await paginate(query, this.roomRepository, {
        defaultLimit: 10,
        sortableColumns: ['code', 'createdAt'],
        defaultSortBy: [
          ['createdAt', 'DESC'],
          ['code', 'ASC'],
        ],
        searchableColumns: ['code'],
        filterableColumns: {
          type: [FilterOperator.EQ],
        },
        where: {
          isPrivate: false,
        },
      }),
      null,
    ];
  }

  async paginationGetAllForAdmin(query: PaginateQuery) {
    return [
      await paginate(query, this.roomRepository, {
        defaultLimit: 10,
        sortableColumns: ['code', 'openTime', 'createdAt'],
        defaultSortBy: [
          ['createdAt', 'DESC'],
          ['code', 'ASC'],
        ],
        searchableColumns: ['code'],
        filterableColumns: {
          isPrivate: [FilterOperator.EQ],
          type: [FilterOperator.EQ],
        },
      }),
      null,
    ];
  }

  async getAllRooms() {
    const rooms = await this.roomRepository.find();
    return [rooms, null];
  }

  /**
   * Constraints for creating a room:
   * + Room code must be unique
   * + openTime must be in the future
   * + closeTime must be greater then openTime
   * + duration must be greater than 1
   * + if the room is public, it must not have closeTime or duration
   * + if the room is private, it must have closeTime and duration
   * @param info
   * @returns
   */
  async createOne(info: CreateRoomDto) {
    const errs = [];
    const checkCode = await this.roomRepository.findOne({
      where: {
        code: info.code,
      },
    });
    if (checkCode) {
      errs.push({
        at: 'code',
        message: 'Room code already exists',
      });
    }
    if (!info.isPrivate && (info.closeTime || info.duration)) {
      errs.push({
        at: 'all',
        message: 'Public room should not have close time or duration',
      });
    }
    if (info.isPrivate && (!info.closeTime || !info.duration)) {
      errs.push({
        at: 'all',
        message: 'Private room must have close time and duration',
      });
    }
    if (errs.length > 0) {
      return [null, errs];
    }
    const room = await this.roomRepository.save({
      code: info.code,
      closeTime: info.closeTime,
      openTime: info.openTime,
      duration: info.duration,
      type: info.type,
      isPrivate: info.isPrivate,
      questions: info.questions.map((question) => ({
        questionImage: question.questionImage,
        maxSubmitTimes: question.maxSubmitTimes,
        colors: question.colors,
        codeTemplate: question.codeTemplate,
        testCases: question.testCases
          ? question.testCases.map((testCase) => ({
              input: testCase.input,
              output: testCase.output,
            }))
          : [],
      })),
    });
    return [room, null];
  }

  /**
   * Update room by id
   * Admin can update a room that is not started (now < openTime)
   * @param id - Room ID
   * @param info
   * @returns [Updated Room, Errors]
   */
  async updateOne(id: number, info: UpdateRoomDto) {
    const errs = [];
    const room = await this.roomRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!room) {
      errs.push({
        at: 'id',
        message: 'Room not found',
      });
    }
    if (room.openTime < new Date()) {
      errs.push({
        at: 'all',
        message: 'Room has already started',
      });
    }
    if (errs.length > 0) {
      return [null, errs];
    }
    room.closeTime = info.closeTime;
    room.openTime = info.openTime;
    const updatedRoom = await this.roomRepository.save(room);
    return [updatedRoom, null];
  }

  async findAll() {
    const rooms = await this.roomRepository.find();
    return [rooms, null];
  }

  async findOneById(id: number): Promise<[Room, any]> {
    const room = await this.roomRepository.findOne({
      where: {
        id: id,
        isPrivate: false,
      },
    });
    if (!room) {
      return [null, 'Room not found'];
    }
    return [room, null];
  }

  async findOneByCode(code: string): Promise<[Room, any]> {
    const room = await this.roomRepository.findOne({
      where: {
        code: code,
      },
    });
    if (!room) {
      return [null, 'Room not found'];
    }
    return [room, null];
  }

  async isExisted(id: number): Promise<boolean> {
    const result = await this.roomRepository.exist({
      where: {
        id,
      },
    });
    return result;
  }

  async isNotOneHourLeft(roomId: string) {
    return await this.roomRepository
      .findOne({
        where: {
          id: parseInt(roomId),
        },
      })
      .then((result) => {
        if (!result) throw new Error('Room cannot be found!');
        const currentTime = new Date();
        const oneHourBeforeCloseTime = new Date(
          result.closeTime.getTime() - 60 * 60 * 1000,
        );
        return currentTime < oneHourBeforeCloseTime;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }
}
