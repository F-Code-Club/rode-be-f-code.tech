import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QuestionService } from './questions.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@auth/jwt-auth.guard';
import Roles from '@decorators/roles.decorator';
import { RoleEnum } from '@etc/enums';
import { RoleGuard } from '@auth/role.guard';
import { CreateQuestionStackDto } from './dtos/create-question-stack.dto';
import ResponseObject from '@etc/response-object';
import { CreateQuestionDto } from './dtos/create-question.dto';
import { CreateTestCaseDto } from './dtos/create-test-case.dto';

@Controller('questions')
@ApiTags('Accounts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}
  @Get('stacks/:id')
  async findOneStack(@Param('id') stackId) {}

  @Get('stacks')
  async getAllStackActive(@Query('active') isActive?: boolean) {}

  @Roles(RoleEnum.MANAGER)
  @Post('create-stack')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  async createQuestionStack(@Body() dto: CreateQuestionStackDto) {
    const [data, err] = await this.questionService.createQuestionStack(dto);
    if (!data)
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Create Question Stack Fail',
        data,
        err,
      );
    return new ResponseObject(
      HttpStatus.OK,
      'Create Question Stack Successful',
      data,
      err,
    );
  }

  @Roles(RoleEnum.MANAGER)
  @Post('create-question')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  async createQuestion(@Body() dto: CreateQuestionDto) {
    const [data, err] = await this.questionService.createQuestion(dto);
    if (!data)
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Create Question Fail',
        data,
        err,
      );
    return new ResponseObject(
      HttpStatus.OK,
      'Create Question Successful',
      data,
      err,
    );
  }

  @Roles(RoleEnum.MANAGER)
  @Post('create-test-case')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  async createTestCase(@Body() dto: CreateTestCaseDto) {
    const [data, err] = await this.questionService.createTestCase(dto);
    if (!data)
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Create Test Case Fail',
        data,
        err,
      );
    return new ResponseObject(
      HttpStatus.OK,
      'Create Test Case Successful',
      data,
      err,
    );
  }
}
