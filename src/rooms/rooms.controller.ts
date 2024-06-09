import { Controller } from '@nestjs/common';
import {
  Body,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common/decorators';
import { HttpStatus } from '@nestjs/common/enums';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import ResponseObject from '../etc/response-object';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role.guard';
import Roles from '../decorators/roles.decorator';
import { RoleEnum } from '../etc/enums';
import { CreateRoomDto } from './dtos/create-room.dto';
import { RoomsService } from './rooms.service';
import { UpdateRoomDto } from './dtos/update-room.dto';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { PaginationDto } from '@etc/pagination.dto';
import { CreateScoreTeamDto } from './dtos/create-score-team';
import { UpdateRoomQuestionStackDto } from './dtos/update-room-question-stack';

@Controller('rooms')
@UseGuards(JwtAuthGuard)
@ApiTags('Rooms')
@ApiBearerAuth()
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get('types')
  @UseGuards(RoleGuard)
  @Roles(RoleEnum.ADMIN)
  async getAllRoomType() {
    const [roomTypes, err] = await this.roomsService.getAllRoomTypes();
    if (!roomTypes) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Get all room types failed!',
        null,
        err,
      );
    }
    return new ResponseObject(
      HttpStatus.OK,
      'Get all room types success!',
      roomTypes,
      null,
    );
  }

  @Post()
  @UseGuards(RoleGuard)
  @Roles(RoleEnum.ADMIN)
  async createOne(@Body() info: CreateRoomDto) {
    const [room, err] = await this.roomsService.createOne(info);
    if (!room) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Create room failed!',
        null,
        err,
      );
    }
    return new ResponseObject(
      HttpStatus.OK,
      'Create room success!',
      room,
      null,
    );
  }

  @Post('teams')
  @UseGuards(RoleGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.MANAGER)
  @ApiBody({ type: CreateScoreTeamDto })
  async addTeamToRoom(@Body() roomTeam: CreateScoreTeamDto) {
    const [data, err] = await this.roomsService.addAllTeamsToRoom(roomTeam);
    if (!data) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Add teams failed!',
        null,
        err,
      );
    }
    return new ResponseObject(HttpStatus.OK, 'Add teams success!', data, null);
  }

  @Patch('stacks')
  @UseGuards(RoleGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.MANAGER)
  async changeRoomQuestionStack(
    @Body() changeRoom: UpdateRoomQuestionStackDto,
  ) {
    const [data, err] = await this.roomsService.updateRoomQuestionStack(
      changeRoom.stackId,
      changeRoom.roomId,
    );
    if (!data) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Update Question Stack For Room Failed!',
        null,
        err,
      );
    }
    return new ResponseObject(
      HttpStatus.OK,
      'Update Question Stack For Room Success!',
      data,
      null,
    );
  }

  @Get('admin-get-all')
  @ApiQuery({ required: false, type: PaginationDto })
  @UseGuards(RoleGuard)
  @Roles(RoleEnum.ADMIN)
  async adminGetAll(@Paginate() query: PaginateQuery) {
    const [rooms, err] = await this.roomsService.paginationGetAllForAdmin(
      query,
    );
    if (!rooms) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Get all rooms failed!',
        null,
        err,
      );
    }
    return new ResponseObject(
      HttpStatus.OK,
      'Get all rooms success!',
      rooms,
      null,
    );
  }

  @Get('user-get-all')
  @ApiQuery({ required: false, type: PaginationDto })
  @UseGuards(RoleGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  async getAll(@Paginate() query: PaginateQuery) {
    const [rooms, err] = await this.roomsService.paginationGetAllForUser(query);
    if (!rooms) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Get all rooms failed!',
        null,
        err,
      );
    }
    return new ResponseObject(
      HttpStatus.OK,
      'Get all rooms success!',
      rooms,
      null,
    );
  }

  @Get('/:id')
  @ApiParam({ name: 'id', description: 'Room ID' })
  @UseGuards(RoleGuard)
  @Roles(RoleEnum.ADMIN)
  async getOneById(@Param('id') id: number) {
    const [room, err] = await this.roomsService.findOneById(id);
    if (err) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Get room failed!',
        null,
        err,
      );
    }
    return new ResponseObject(HttpStatus.OK, 'Get room success!', room, null);
  }

  @Get('codes/:code')
  @ApiParam({ name: 'code', description: 'Room code' })
  async getOneByCode(@Param('code') code: string) {
    const [room, err] = await this.roomsService.findOneByCode(code);
    if (err) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Get room failed!',
        null,
        err,
      );
    }
    return new ResponseObject(HttpStatus.OK, 'Get room success!', room, null);
  }

  @Put('/:id')
  @ApiParam({ name: 'id', description: 'Room ID' })
  @UseGuards(RoleGuard)
  @Roles(RoleEnum.ADMIN)
  async updateOneById(@Param('id') id: number, @Body() info: UpdateRoomDto) {
    const [room, err] = await this.roomsService.updateOne(id, info);
    if (!room) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Update room failed!',
        null,
        err,
      );
    }
    return new ResponseObject(
      HttpStatus.OK,
      'Update room success!',
      room,
      null,
    );
  }
}
