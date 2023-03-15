import { JwtAuthGuard } from '@auth/jwt-auth.guard';
import ResponseObject from '@etc/response-object';
import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  Body,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SubmitHistoryService } from './submit-history.service';

@Controller('submit-history')
@UseGuards(JwtAuthGuard)
@ApiTags('SubmitHistory')
@ApiBearerAuth()
export class SubmitHistoryController {
  constructor(private readonly submitHistoryService: SubmitHistoryService) {}

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
}
