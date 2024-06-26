import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionStackStatus, RoomTypeEnum } from '@etc/enums';
import { DataSource, In, Repository } from 'typeorm';
import { CreateRoomDto } from './dtos/create-room.dto';
import { Room } from './entities/room.entity';
import { UpdateRoomDto } from './dtos/update-room.dto';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { QuestionStack } from '@questions/entities/question-stack.entity';
import { Score } from 'scores/entities/scores.entity';
import { CreateScoreTeamDto } from './dtos/create-score-team';
import { Team } from '@teams/entities/team.entity';
import { LogService } from '@logger/logger.service';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(QuestionStack)
    private readonly questionStackRepository: Repository<QuestionStack>,
    private readonly dataSource: DataSource,
    private readonly logger: LogService,
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
    this.logger.debug(info.questionStackId);
    const questionStack: QuestionStack | undefined =
      await this.questionStackRepository.findOne({
        where: {
          id: info.questionStackId,
          status: QuestionStackStatus.ACTIVE,
          type: info.type,
        },
      });
    const checkCode = await this.roomRepository.findOne({
      where: {
        code: info.code.toUpperCase(),
      },
    });
    if (checkCode) {
      errs.push({
        at: 'code',
        message: 'Room code already exists',
      });
    }
    if (!questionStack) {
      errs.push({
        at: 'questionStackId',
        message: 'Not found stack with this id or this stack is not active',
      });
    }
    if (errs.length > 0) {
      return [null, errs];
    }
    try {
      const result = await this.dataSource.transaction(async (manager) => {
        const newRoom: Room = await manager.save(Room, {
          code: info.code.toUpperCase(),
          closeTime: info.closeTime,
          openTime: info.openTime,
          type: info.type,
          isPrivate: info.isPrivate,
          questionStack: questionStack,
        });
        questionStack.status = QuestionStackStatus.USED;
        await manager.save(QuestionStack, questionStack);
        return newRoom;
      });
      return [result, null];
    } catch (err) {
      this.logger.error(err);
      return [null, 'Create room failed'];
    }
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
        isPrivate: true,
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
        code: code.toUpperCase(),
      },
    });
    if (!room) {
      return [null, 'Room not found'];
    }
    return [room, null];
  }

  async isExisted(id: number): Promise<boolean> {
    const result = await this.roomRepository.exists({
      where: {
        id,
      },
    });
    return result;
  }

  async isNotOneHourLeft(roomId: number) {
    return await this.roomRepository
      .findOne({
        where: {
          id: roomId,
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

  async updateRoomQuestionStack(stackId: string, roomId: number) {
    const roomResult: Room | undefined = await this.roomRepository.findOne({
      where: { id: roomId },
    });
    if (!roomResult) return [null, 'Room Id is not corrected'];
    const currentTime = new Date();
    if (roomResult.openTime < currentTime)
      return [null, 'Room is started, cant update any more'];
    const stackResult: QuestionStack | undefined =
      await this.questionStackRepository.findOne({
        where: {
          id: stackId,
          status: QuestionStackStatus.ACTIVE,
          type: roomResult.type,
        },
      });
    if (!stackResult)
      return [
        null,
        'Stack Id is not corrected or stack is not right type of room',
      ];
    const currentStack = roomResult.questionStack;
    currentStack.status = QuestionStackStatus.ACTIVE;
    stackResult.status = QuestionStackStatus.USED;
    roomResult.questionStack = stackResult;
    try {
      await this.dataSource.transaction(async (manager) => {
        await manager.save(roomResult);
        await manager.save(stackResult);
        await manager.save(currentStack);
      });
    } catch (err) {
      this.logger.error(err);
      return [null, 'Errors when changing question stack'];
    }
    return [roomResult, null];
  }

  async addAllTeamsToRoom(roomTeam: CreateScoreTeamDto) {
    if (!roomTeam?.roomCode) return [null, 'Enter room code and try again'];
    const roomEntity: Room | undefined = await this.roomRepository.findOne({
      where: {
        code: roomTeam.roomCode.toUpperCase(),
      },
    });
    if (!roomEntity)
      return [
        null,
        `Not found room with code ${roomTeam.roomCode.toUpperCase()}`,
      ];
    if (roomTeam.teamIds.length == 0) return ['Adding team successfully', null];
    const teamList = await this.dataSource
      .getRepository(Team)
      .createQueryBuilder()
      .where('id IN (:...ids)', { ids: roomTeam.teamIds })
      .getMany();
    if (teamList?.length) {
      if (teamList.length != roomTeam.teamIds.length) {
        return [
          null,
          `Check groups of team id again, wrong ${Math.abs(
            roomTeam.teamIds.length - teamList.length,
          )} of ${roomTeam.teamIds.length}`,
        ];
      }
      const count: [Score[], number] = await this.dataSource
        .getRepository(Score)
        .findAndCount({
          where: {
            room: roomEntity,
            team: In(roomTeam.teamIds),
          },
          relations: ['team'],
          loadEagerRelations: false,
        });
      if (count[1]) {
        const idTeamMatch: number[] = count[0].map((value) => {
          return value.team.id;
        });
        return [
          null,
          `This team with this ids: ${idTeamMatch.join(
            ', ',
          )}, has been added to room, please select again`,
        ];
      }
      try {
        await this.dataSource
          .transaction(async (manager) => {
            const scoreList: Score[] = [];
            teamList.forEach((team) => {
              const tempScore = new Score();
              tempScore.room = roomEntity;
              tempScore.penalty = 0;
              tempScore.totalScore = 0;
              tempScore.team = team;
              scoreList.push(tempScore);
            });
            await manager.save(scoreList);
            const teamListCount = await manager.getRepository(Score).count({
              where: {
                room: roomEntity,
              },
            });
            if (teamListCount > roomEntity.size)
              throw new Error('Room has maximum size');
          })
          .catch((error) => {
            throw new Error(error);
          });
      } catch (err) {
        this.logger.error(err);
        return [null, `Error when adding team to room with: ${err?.message}`];
      }
    }
    return ['Adding team success', null];
  }
}
