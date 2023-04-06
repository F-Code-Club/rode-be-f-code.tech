import { Injectable } from '@nestjs/common';
import { RoomsService } from '../rooms/rooms.service';
import { SubmitDto } from './dtos/submit.dto';
import { ProgrammingLangEnum, RoomTypeEnum } from '../etc/enums';
import { C_CPPService } from './compile-and-execute-services/c_cpp.service';
import { JavaService } from './compile-and-execute-services/java.service';
import { PixelMatchService } from './pixel-match.service';
import { RenderImageDto } from './dtos/render-image.dto';
import { BeResultDto } from './dtos/be-result.dto';
import { FeResultDto } from './dtos/fe-result.dto';
import { Account } from '@accounts/entities/account.entity';
import { SubmitHistoryService } from 'submit-history/submit-history.service';
import { SubmitHistory } from 'submit-history/entities/submit-history.entity';
import { Log } from '@logger/logger.decorator';
import { LogService } from '@logger/logger.service';
import { SubmitTimesDto } from 'submit-history/dtos/submit-times';
import { Repository } from 'typeorm';
import { UserRoom } from 'user-rooms/entities/user-room.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ScoringService {
  constructor(
    @Log('ScoringService') private readonly logger: LogService,
    private readonly roomsService: RoomsService,
    private readonly c_cppService: C_CPPService,
    private readonly javaService: JavaService,
    private readonly pixelMatchService: PixelMatchService,
    private readonly submitHistoryService: SubmitHistoryService,
    @InjectRepository(UserRoom)
    private readonly userRoomRepository: Repository<UserRoom>,
  ) {}

  async submit(submitDto: SubmitDto, account: Account) {
    this.logger.log(
      '<submit> ' + submitDto.roomId + ' ' + submitDto.questionId,
    );
    //const [room, err] = await this.roomsService.findOneById(submitDto.roomId);
    const userRoom = await this.userRoomRepository.findOne({
      relations: {
        room: {
          questions: true,
        },
        account: true,
      },
      where: {
        room: {
          id: submitDto.roomId,
        },
        account: {
          id: account.id,
        },
      },
    });
    if (!userRoom) return [null, `You didn't join this room`];
    this.logger.log('<submit> roomId: ' + submitDto.roomId + ' existed');
    const room = userRoom.room;
    this.logger.log('<submit> Check valid time to submit');
    if (room.isPrivate) {
      this.logger.debug('userRoom.joinTime: ' + userRoom.joinTime.getTime());
      this.logger.debug('Date.now(): ' + Date.now());
      this.logger.debug(
        'Time to close submit: ' +
          (userRoom.joinTime.getTime() + room.duration * 60 * 1000),
      );
      const now = Date.now();
      if (
        now < userRoom.joinTime.getTime() ||
        now > userRoom.joinTime.getTime() + room.duration * 60 * 1000
      ) {
        this.logger.log('<submit> Time to submit is over');
        return [null, 'Time to submit is over'];
      }
    }

    const question = room.questions.find(
      (ele) => ele.id == submitDto.questionId,
    );
    if (!question) {
      return [null, 'Question not found'];
    }
    this.logger.log(
      '<submit> questionId: ' + submitDto.questionId + ' existed',
    );

    this.logger.log('<submit> Check valid number of submissions');
    const submitTimes = await this.checkNumberOfSubmissions(
      account.id,
      question.id,
      question.maxSubmitTimes,
    );
    if (!submitTimes)
      return [null, 'You have reached the maximum number of submissions'];

    //result for return to client
    let submitResult: BeResultDto | FeResultDto;

    //entity for save submission to database
    const submission = new SubmitHistory(
      account,
      question,
      submitDto.code,
      submitDto.language,
    );

    this.logger.log('submit: languageSubmission ' + submitDto.language);
    switch (room.type) {
      case RoomTypeEnum.BE: {
        submitResult = new BeResultDto();
        switch (submitDto.language) {
          case ProgrammingLangEnum.C_CPP: {
            const [result, error] = this.c_cppService.compileAndExecute(
              submitDto.code,
              question.testCases,
            );
            if (error) return [null, error];
            submission.score = result.passedTestCases;
            submission.time = result.execTime;
            Object.assign(submitResult, result);
            break;
          }
          case ProgrammingLangEnum.JAVA: {
            const [result, error] = this.javaService.compileAndExecute(
              submitDto.code,
              question.testCases,
            );
            if (error) return [null, error];
            submission.score = result.passedTestCases;
            submission.time = result.execTime;
            Object.assign(submitResult, result);
            break;
          }
          default: {
            return [null, 'Language not supported'];
          }
        }
        break;
      }
      case RoomTypeEnum.FE: {
        submitResult = new FeResultDto();
        const [result, error] = await this.pixelMatchService.score(
          question.questionImage,
          submitDto.code,
        );
        if (error) return [null, error];
        submission.score = result.match;
        submission.space = result.coc;
        Object.assign(submitResult, result);
        break;
      }
      default: {
        return [null, 'Room type not supported'];
      }
    }
    this.logger.log('score: ' + submission.score);
    this.logger.log('space: ' + submission.space);
    this.logger.log('time: ' + submission.time);
    this.logger.log('submit: Saving submission...');
    await this.submitHistoryService.createSubmit(submission);

    this.logger.log('submit: Saved submission!!!');
    return [{ result: submitResult, times: submitTimes }, null];
  }
  async renderImage(info: RenderImageDto) {
    return await this.pixelMatchService.renderImage(info.html);
  }
  async renderDiffImage(submitDto: SubmitDto) {
    const [room, err] = await this.roomsService.findOneById(submitDto.roomId);
    if (err) {
      return [null, err];
    }
    const question = room.questions.find(
      (ele) => ele.id == submitDto.questionId,
    );
    if (!question) {
      return [null, 'Question not found'];
    }
    if (room.type != RoomTypeEnum.FE) {
      return [null, 'Room type not supported'];
    }
    return await this.pixelMatchService.renderDiffImage(
      question.questionImage,
      submitDto.code,
    );
  }
  async checkNumberOfSubmissions(
    accountId: string,
    questionId: string,
    maxSubmitTimes: number,
  ): Promise<SubmitTimesDto> {
    let count = await this.submitHistoryService.countNumberOfSubmissions(
      accountId,
      questionId,
    );
    if (count < maxSubmitTimes) {
      const submitTimes = new SubmitTimesDto(++count, maxSubmitTimes);
      this.logger.log(
        '<checkNumberOfSubmissions> Number Of Submissions: ' +
          submitTimes.current +
          '/' +
          submitTimes.max,
      );
      return submitTimes;
    } else {
      this.logger.log(
        '<checkNumberOfSubmissions> ' +
          'You have reached the maximum number of submissions',
      );
      return null;
    }
  }
}
