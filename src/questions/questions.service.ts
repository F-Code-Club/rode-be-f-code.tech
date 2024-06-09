import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionStack } from './entities/question-stack.entity';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { QuestionStackStatus } from '@etc/enums';
import { CreateQuestionStackDto } from './dtos/create-question-stack.dto';
import { CreateQuestionDto } from './dtos/create-question.dto';
import { QuestionTestCase } from './entities/question-test-case.entity';
import { CreateTestCaseDto } from './dtos/create-test-case.dto';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(QuestionStack)
    private readonly questionStackRepository: Repository<QuestionStack>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(QuestionTestCase)
    private readonly questionTestCaeRepository: Repository<QuestionTestCase>,
  ) {}

  async findQuestionStackById(stackId: string) {
    const quetyResult = await this.questionStackRepository.findOne({
      where: {
        id: stackId,
        status: QuestionStackStatus.ACTIVE,
      },
    });
  }

  async createQuestionStack(dto: CreateQuestionStackDto) {
    try {
      await this.questionStackRepository.insert({
        name: dto.name,
        stackMax: dto.stack_max,
        status: dto.status,
        type: dto.type,
      });
      return ['Create question stack successful', null];
    } catch (err) {
      return [null, 'Cannot insert question stack'];
    }
  }

  async createQuestion(stackId: string, dto: CreateQuestionDto) {
    const qs: QuestionStack = await this.questionStackRepository.findOne({
      where: {
        id: stackId,
      },
    });

    if (!qs) return [null, 'Cannot found question_stack'];
    if (qs.status == QuestionStackStatus.USED)
      return [null, 'Question Stack is in USED'];

    try {
      await this.questionRepository.insert({
        stack: qs,
        maxSubmitTimes: dto.max_submit_time,
        score: dto.score,
      });
      return ['Create question successful', null];
    } catch (err) {
      return [null, 'Insert question fail'];
    }
  }

  async createTestCase(questionId: string, dto: CreateTestCaseDto) {
    const question: Question = await this.questionRepository.findOne({
      where: {
        id: questionId,
      },
    });
    if (!question) return [null, 'Cannot found question'];
    if (question.stack.status == QuestionStackStatus.USED)
      return [null, 'Question Stack is in USED'];
    try {
      await this.questionTestCaeRepository.insert({
        question: question,
        input: dto.input,
        output: dto.output,
      });
      return ['Create test case successful', null];
    } catch (err) {
      return [null, 'Cannot insert testcase'];
    }
  }
}
