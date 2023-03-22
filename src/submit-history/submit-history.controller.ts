import { JwtAuthGuard } from '@auth/jwt-auth.guard';
import ResponseObject from '@etc/response-object';
import {
  Controller,
  Get,
  HttpStatus,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SubmitHistoryService } from './submit-history.service';
import CurrentAccount from '@decorators/current-account.decorator';
import { Account } from '@accounts/entities/account.entity';
import { PaginationDto } from '@etc/pagination.dto';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

@Controller('submit-history')
@UseGuards(JwtAuthGuard)
@ApiTags('SubmitHistory')
@ApiBearerAuth()
export class SubmitHistoryController {
  constructor(private readonly submitHistoryService: SubmitHistoryService) {}

  @Get('get-by-question-v2/:question')
  @ApiQuery({ type: PaginationDto })
  async paginateGetByQuestion(
    @Param('question') question: string,
    @Paginate() query: PaginateQuery,
  ) {
    const [submitHistory, err] =
      await this.submitHistoryService.paginateGetByQuestion(question, query);
    if (!question || !submitHistory) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Get leader board failed!',
        null,
        err,
      );
    }

    return new ResponseObject(
      HttpStatus.OK,
      'Get leader board successfully!',
      submitHistory,
      null,
    );
  }

  @Get('get-by-question/:question')
  async getByQuestion(@Param('question') question: string) {
    const [submitHistory, err] = await this.submitHistoryService.getByQuestion(
      question,
    );
    if (!question || !submitHistory) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Get leader board failed!',
        null,
        err,
      );
    }

    return new ResponseObject(
      HttpStatus.OK,
      'Get leader board successfully!',
      submitHistory,
      null,
    );
  }

  @Get('get-by-room-v2/:roomId')
  @ApiQuery({ type: PaginationDto })
  async getByRoomv2(
    @Param('roomId') roomId: string,
    @Paginate() query: PaginateQuery,
  ) {
    const [submits, err] = await this.submitHistoryService.paginateGetByRoom(
      roomId,
      query,
    );
    if (!submits)
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Room not exist!',
        null,
        err,
      );
    return new ResponseObject(
      HttpStatus.OK,
      'Get all leader board success!',
      submits,
      null,
    );
  }

  @Get('get-by-room/:roomId')
  async getByRoom(@Param('roomId') roomId: string) {
    const [submits, err] = await this.submitHistoryService.getByRoom(roomId);
    if (!submits)
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Room not exist!',
        null,
        err,
      );
    return new ResponseObject(
      HttpStatus.OK,
      'Get all leader board success!',
      submits,
      null,
    );
  }

  @Get('get-user-history')
  @ApiQuery({ name: 'roomId', required: false })
  @ApiQuery({ name: 'questionId', required: false })
  async showUserHistory(
    @CurrentAccount() curAccount: Account,
    @Query('roomId') roomId: string,
    @Query('questionId') questionId: string,
  ) {
    const [submits, err] = await this.submitHistoryService.showUserHistory(
      curAccount.id,
      roomId,
      questionId,
    );
    if (!submits)
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Get submits failed',
        null,
        err,
      );
    return new ResponseObject(
      HttpStatus.OK,
      'Get all submits success!',
      submits,
      null,
    );
  }
}
