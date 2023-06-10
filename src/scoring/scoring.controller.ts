import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ScoringService } from './scoring.service';
import { SubmitDto } from './dtos/submit.dto';
import ResponseObject from '@etc/response-object';
import { RenderImageDto } from './dtos/render-image.dto';
import { Response } from 'express';
import { RoleGuard } from '@auth/role.guard';
import Roles from '@decorators/roles.decorator';
import { RoleEnum } from '@etc/enums';
import { Account } from '@accounts/entities/account.entity';
import CurrentAccount from '@decorators/current-account.decorator';

@Controller('scoring')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Scoring')
export class ScoringController {
  constructor(private readonly scoringService: ScoringService) {}

  @Post('render-image')
  async renderImage(@Body() body: RenderImageDto, @Res() res: Response) {
    const [result, err] = await this.scoringService.renderImage(body);
    res.header('Content-Type', 'image/png');
    return res.send(result);
  }

  @Post('render-diff-image')
  async renderDiffImage(@Body() body: SubmitDto, @Res() res: Response) {
    const [result, err] = await this.scoringService.renderDiffImage(body);
    res.header('Content-Type', 'image/png');
    return res.send(result);
  }

  @Post('submit')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RoleEnum.USER)
  async submit(@Body() body: SubmitDto, @CurrentAccount() curAccount: Account) {
    const [result, err] = await this.scoringService.submit(body, curAccount);
    if (err) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Submit failed!',
        null,
        err,
      );
    }
    return new ResponseObject(HttpStatus.OK, 'Submit success!', result, null);
  }

  @Post('submit-v2')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RoleEnum.USER)
  async submitV2(
    @Body() body: SubmitDto,
    @CurrentAccount() curAccount: Account,
  ) {
    const [result, err] = await this.scoringService.submitV2(body, curAccount);
    if (err) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Submit failed!',
        null,
        err,
      );
    }
    return new ResponseObject(HttpStatus.OK, 'Submit success!', result, null);
  }
}
