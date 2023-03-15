import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Body,
} from '@nestjs/common';
import { UserRoomsService } from './user-rooms.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@auth/jwt-auth.guard';
import { RoleGuard } from '@auth/role.guard';
import Roles from '@decorators/roles.decorator';
import { RoleEnum } from '@etc/enums';
import { Account } from '@accounts/entities/account.entity';
import CurrentAccount from '@decorators/current-account.decorator';
import ResponseObject from '@etc/response-object';
import { JoinRoomDto } from './dtos/join-room.dto';
import { CheckAttendanceDto } from './dtos/check-attendance.dto';

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

  @Get('users/:roomId')
  @ApiOperation({ summary: 'Get all users in room' })
  @Roles(RoleEnum.ADMIN)
  async findAllUsersInRoom(@Param('roomId') roomId: string) {
    const [userRooms, error] = await this.userRoomsService.findAllUsersInRoom(
      roomId,
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
  @Roles(RoleEnum.USER)
  async findAllRoomsOfUser(@CurrentAccount() curAccount: Account) {
    const rooms = this.userRoomsService.findAllRoomsOfUser(curAccount);
    return new ResponseObject(
      HttpStatus.OK,
      'Get all rooms that user joined success!',
      rooms,
      null,
    );
  }

  @Post('check-attendance/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check Attendance for Users' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RoleEnum.ADMIN)
  async checkAttendance(@Body() info: CheckAttendanceDto) {
    let results = [];
    for (var i = 0; i < info.id.length; i++) {
      const [check, err] = await this.userRoomsService.checkAttendance(
        info.id[i],
      );
      results.push([check, err]);
    }
    if (!results) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Check Attendance failed!',
        null,
        results,
      );
    }
    return new ResponseObject(
      HttpStatus.OK,
      'Check Attendance success!',
      results,
      null,
    );
  }
}
