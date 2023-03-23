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
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
@Controller('submit-history')
@UseGuards(JwtAuthGuard)
@ApiTags('SubmitHistory')
@ApiBearerAuth()
export class SubmitHistoryController {
  constructor(private readonly submitHistoryService: SubmitHistoryService) {}

  @Get('get-by-question/:question')
  // @ApiQuery({ type: PaginationDto })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getByQuestion(
    @Param('question') question: string,
    @Query() query: IPaginationOptions,
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

  @Get('get-by-room/:roomId')
  // @ApiQuery({ type: PaginationDto })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getByRoom(
    @Param('roomId') roomId: string,
    @Query() query: IPaginationOptions,
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
