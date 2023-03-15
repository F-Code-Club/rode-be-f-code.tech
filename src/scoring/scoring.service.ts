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

@Injectable()
export class ScoringService {
  constructor(
    private readonly roomsService: RoomsService,
    private readonly c_cppService: C_CPPService,
    private readonly javaService: JavaService,
    private readonly pixelMatchService: PixelMatchService,
    private readonly submitHistoryService: SubmitHistoryService,
  ) {}

  async submit(
    submitDto: SubmitDto,
    account: Account,
  ): Promise<[BeResultDto | FeResultDto, any]> {
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

    //result for return to client
    let submitResult: BeResultDto | FeResultDto;

    //entity for save submission to database
    const submission = new SubmitHistory();
    submission.account = account;
    submission.question = question;
    submission.submissions = submitDto.code;
    submission.language = submitDto.language;

    switch (room.type) {
      case RoomTypeEnum.BE: {
        switch (submitDto.language) {
          case ProgrammingLangEnum.C_CPP: {
            const [submitResult, submitError] =
              this.c_cppService.compileAndExecute(
                submitDto.code,
                question.testCases,
              );
            if (submitError) return [null, submitError];
            submission.score =
              submitResult.testCaseStatistics.filter(Boolean).length;
            submission.time = submitResult.execTime;
            break;
          }
          case ProgrammingLangEnum.JAVA: {
            const [submitResult, submitError] =
              this.javaService.compileAndExecute(
                submitDto.code,
                question.testCases,
              );
            if (submitError) return [null, submitError];
            submission.score =
              submitResult.testCaseStatistics.filter(Boolean).length;
            submission.time = submitResult.execTime;
            break;
          }
          default: {
            return [null, 'Language not supported'];
          }
        }
      }
      case RoomTypeEnum.FE: {
        const [submitResult, submitError] = await this.pixelMatchService.score(
          question.questionImage,
          submitDto.code,
        );
        if (submitError) return [null, submitError];
        submission.score = submitResult.match;
        submission.space = submitResult.coc;
        break;
      }
      default: {
        return [null, 'Room type not supported'];
      }
    }
    await this.submitHistoryService.createSubmit(submission);
    return [submitResult, null];
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
}
