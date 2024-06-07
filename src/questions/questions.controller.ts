import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QuestionService } from './questions.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@auth/jwt-auth.guard';
import Roles from '@decorators/roles.decorator';
import { QuestionStackStatus, RoleEnum } from '@etc/enums';
import { RoleGuard } from '@auth/role.guard';
import {
  CreateQuestionStackDto,
  UpdateQuestionStackDto,
} from './dtos/question-stack.dto';
import ResponseObject from '@etc/response-object';
import { CreateQuestionDto, UpdateQuestionDto } from './dtos/question.dto';
import { CreateTestCaseDto, UpdateTestCaseDto } from './dtos/test-case.dto';

@Controller('questions')
@ApiTags('Questions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  //                         //
  /*-----Question Stacks-----*/
  //                         //

  @Roles(RoleEnum.MANAGER, RoleEnum.ADMIN)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('get-one-stack/:id')
  async findOneStack(@Param('id') stackId: string) {
    const [data, err] = await this.questionService.findOneQuestionStackById(
      stackId,
    );

    if (!data) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Get Stack Failed!',
        data,
        err,
      );
    }

    return new ResponseObject(
      HttpStatus.OK,
      'Get Stack Successful!',
      data,
      err,
    );
  }

  @Roles(RoleEnum.MANAGER, RoleEnum.ADMIN)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('get-all-stacks')
  async getAllStackByStatus(@Query('status') status: QuestionStackStatus) {
    const [data, err] = await this.questionService.findQuestionsStackByStatus(
      status,
    );

    if (!data) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Get All Stack Failed!',
        data,
        err,
      );
    }

    return new ResponseObject(
      HttpStatus.OK,
      'Get All Stack Successful!',
      data,
      err,
    );
  }

  @Roles(RoleEnum.MANAGER, RoleEnum.ADMIN)
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

  @Roles(RoleEnum.MANAGER, RoleEnum.ADMIN)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Patch('update-question-stack/:stack_id')
  @ApiBody({ type: UpdateQuestionStackDto })
  async updateQuestionStack(
    @Param('stack_id') stack_id: string,
    @Body() updatedFields: UpdateQuestionStackDto,
  ) {
    const [data, err] = await this.questionService.updateQuestionStack(
      stack_id,
      updatedFields,
    );

    if (!data)
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Update Question Stack Failed!',
        data,
        err,
      );
    return new ResponseObject(
      HttpStatus.OK,
      'Update Question Stack Successful!',
      data,
      err,
    );
  }

  @Roles(RoleEnum.MANAGER, RoleEnum.ADMIN)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete('remove-question-stack/:stack_id')
  async removeQuestionStack(@Param('stack_id') stack_id: string) {
    const [data, err] = await this.questionService.removeQuestionStackById(
      stack_id,
    );

    if (!data)
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Remove Question Stack Failed!',
        data,
        err,
      );
    return new ResponseObject(
      HttpStatus.OK,
      'Remove Question Stack Successful!',
      data,
      err,
    );
  }

  //                   //
  /*-----Questions-----*/
  //                   //

  @Roles(RoleEnum.MANAGER, RoleEnum.ADMIN)
  @Get('get-question/:question_id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  async findOneQuestion(@Param('question_id') question_id: string) {
    const [data, err] = await this.questionService.findOneQuestionById(
      question_id,
    );

    if (!data)
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Find A Question Failed!',
        data,
        err,
      );
    return new ResponseObject(
      HttpStatus.OK,
      'Find A Question Successful!',
      data,
      err,
    );
  }

  @Roles(RoleEnum.MANAGER, RoleEnum.ADMIN)
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

  @Roles(RoleEnum.MANAGER, RoleEnum.ADMIN)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Patch('update-question/:question_id')
  @ApiBody({ type: UpdateQuestionDto })
  async updateQuestion(
    @Param('question_id') question_id: string,
    @Body() updatedFields: UpdateQuestionDto,
  ) {
    const [data, err] = await this.questionService.updateQuestion(
      question_id,
      updatedFields,
    );

    if (!data)
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Update Question Failed!',
        data,
        err,
      );
    return new ResponseObject(
      HttpStatus.OK,
      'Update Question Successful!',
      data,
      err,
    );
  }

  @Roles(RoleEnum.MANAGER, RoleEnum.ADMIN)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete('remove-question/:question_id')
  async removeQuestion(@Param('question_id') question_id: string) {
    const [data, err] = await this.questionService.removeQuestionById(
      question_id,
    );

    if (!data)
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Remove Question Failed!',
        data,
        err,
      );
    return new ResponseObject(
      HttpStatus.OK,
      'Remove Question Successful!',
      data,
      err,
    );
  }

  //                    //
  /*-----Test Cases-----*/
  //                    //
  @Roles(RoleEnum.MANAGER, RoleEnum.ADMIN)
  @Get('get-test-case/:testCase_id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  async findOneTestCaseById(
    @Param('question_id') question_id: string,
    @Param('testCase_id') testCase_id: number,
  ) {
    const [data, err] = await this.questionService.findOneTestCaseById(
      testCase_id,
    );

    if (!data)
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Get Test Case Failed',
        data,
        err,
      );
    return new ResponseObject(
      HttpStatus.OK,
      'Get Test Case Successful',
      data,
      err,
    );
  }

  @Roles(RoleEnum.MANAGER, RoleEnum.ADMIN)
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

  @Roles(RoleEnum.MANAGER, RoleEnum.ADMIN)
  @Patch('update-test-case/:testCase_id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  async updateTestCase(
    @Param('testCase_id') testCase_id: number,
    @Body() updatedFields: UpdateTestCaseDto,
  ) {
    const [data, err] = await this.questionService.updateTestCase(
      testCase_id,
      updatedFields,
    );

    if (!data)
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Update Test Case Failed!',
        data,
        err,
      );
    return new ResponseObject(
      HttpStatus.OK,
      'Update Test Case Successful!',
      data,
      err,
    );
  }

  @Roles(RoleEnum.MANAGER, RoleEnum.ADMIN)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete('remove-test-case/:testCase_id')
  async removeTestCase(@Param('testCase_id') testCase_id: number) {
    const [data, err] = await this.questionService.removeTestCaseById(
      testCase_id,
    );

    if (!data)
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Remove Test Case Failed!',
        data,
        err,
      );
    return new ResponseObject(
      HttpStatus.OK,
      'Remove Test Case Successful!',
      data,
      err,
    );
  }
}
