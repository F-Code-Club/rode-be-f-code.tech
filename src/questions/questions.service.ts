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
    let error;
    try {
      let qs: QuestionStack = new QuestionStack();
      qs.name = dto.name;
      qs.stackMax = dto.stack_max;
      qs.status = dto.status;
      qs.type = dto.type;
      return [await this.questionStackRepository.save(qs), null];
    } catch (err) {
      error = err.message;
    }
    return [null, error];
  }

  async createQuestion(dto: CreateQuestionDto) {
    let error;
    try {
      let qs: QuestionStack = await this.questionStackRepository.findOne({
        where: {
          id: dto.stack_id,
        },
      });
      if (qs) {
        let question: Question = new Question();
        question.stack = qs;
        question.maxSubmitTimes = dto.max_submit_time;
        question.score = dto.score;
        return [await this.questionRepository.save(question), null];
      } else error = 'Cannot found question_stack';
    } catch (err) {
      error = err.message;
    }
    return [null, error];
  }

  async createTestCase(dto: CreateTestCaseDto) {
    let error;
    try {
      let question: Question = await this.questionRepository.findOne({
        where: {
          id: dto.question_id,
        },
      });
      if (question) {
        let qtc: QuestionTestCase = new QuestionTestCase();
        qtc.question = question;
        qtc.input = dto.input;
        qtc.output = dto.output;
        return [await this.questionTestCaeRepository.save(qtc), null];
      } else error = 'Cannot found question';
    } catch (err) {
      error = err.message;
    }
    return [null, error];
  }
}
