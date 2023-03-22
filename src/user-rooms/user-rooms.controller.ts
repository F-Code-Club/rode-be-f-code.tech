import {
  Controller,
  Get,
  Post,
  UseGuards,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Body,
  Query,
  Param,
} from '@nestjs/common';
import { UserRoomsService } from './user-rooms.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@auth/jwt-auth.guard';
import { RoleGuard } from '@auth/role.guard';
import Roles from '@decorators/roles.decorator';
import { RoleEnum } from '@etc/enums';
import { Account } from '@accounts/entities/account.entity';
import CurrentAccount from '@decorators/current-account.decorator';
import ResponseObject from '@etc/response-object';
import { JoinRoomDto } from './dtos/join-room.dto';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { PaginationDto } from '../etc/pagination.dto';

@Controller('user-rooms')
@UseGuards(JwtAuthGuard, RoleGuard)
@ApiTags('UserRooms')
@ApiBearerAuth()
export class UserRoomsController {
  constructor(private readonly userRoomsService: UserRoomsService) {}

  /**
   * User Join Room
   * - public room: user can join without code
   * - private room: user must enter code to join
   * @param roomReq
   * @param curAccount
   * @returns
   */
  @Post('join')
  @ApiOperation({ summary: 'Join room' })
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  @Roles(RoleEnum.USER)
  async join(
    @Body() joinRoomDTO: JoinRoomDto,
    @CurrentAccount() curAccount: Account,
  ) {
    const [userRoom, err] = await this.userRoomsService.join(
      joinRoomDTO,
      curAccount,
    );
    if (err) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Join room failed!',
        null,
        err,
      );
    }
    return new ResponseObject(
      HttpStatus.OK,
      'Join room success!',
      userRoom,
      null,
    );
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users in a room' })
  @Roles(RoleEnum.ADMIN)
  @ApiQuery({ name: 'roomId', required: true })
  @ApiQuery({ type: PaginationDto })
  async findAllUsersInRoom(
    @Query('roomId') roomId: string,
    @Paginate() query: PaginateQuery,
  ) {
    const [userRooms, error] = await this.userRoomsService.findAllUsersInRoom(
      roomId,
      query,
    );
    if (error) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Get all users in room failed!',
        null,
        error,
      );
    }
    return new ResponseObject(
      HttpStatus.OK,
      'Get all users in room success!',
      userRooms,
      null,
    );
  }

  @Get('rooms/joined')
  @ApiOperation({ summary: 'Get all rooms that user joined' })
  @ApiQuery({ type: PaginationDto })
  @Roles(RoleEnum.USER)
  async findAllRoomsOfUser(
    @CurrentAccount() curAccount: Account,
    @Paginate() query: PaginateQuery,
  ) {
    const rooms = await this.userRoomsService.findAllRoomsOfUser(
      curAccount.id,
      query,
    );
    return new ResponseObject(
      HttpStatus.OK,
      'Get all rooms that user joined success!',
      rooms,
      null,
    );
  }

  @Post('check-attendance/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'check attendance by userRoomId' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RoleEnum.ADMIN)
  async checkAttendance(@Param('id') id: string) {
    const [check, err] = await this.userRoomsService.checkAttendance(id);
    if (!check) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'check attendance failed!',
        null,
        err,
      );
    }
    return new ResponseObject(
      HttpStatus.OK,
      'check attendance success!',
      check,
      null,
    );
  }

  @Post('finish/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'update finish time by user-room id' })
  async finish(@Param('id') id: string) {
    const [userRoom, err] = await this.userRoomsService.finish(id);
    if (!userRoom) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'update finish time failed!',
        null,
        err,
      );
    }
    return new ResponseObject(
      HttpStatus.OK,
      'update finish time success!',
      userRoom,
      null,
    );
  }
}
