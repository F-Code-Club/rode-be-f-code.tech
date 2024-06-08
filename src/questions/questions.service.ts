import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionStack } from './entities/question-stack.entity';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { QuestionStackStatus } from '@etc/enums';
import {
  CreateQuestionStackDto,
  UpdateQuestionStackDto,
} from './dtos/question-stack.dto';
import { CreateQuestionDto, UpdateQuestionDto } from './dtos/question.dto';
import { QuestionTestCase } from './entities/question-test-case.entity';
import { CreateTestCaseDto, UpdateTestCaseDto } from './dtos/test-case.dto';
import { LogService } from '@logger/logger.service';
@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(QuestionStack)
    private readonly questionStackRepository: Repository<QuestionStack>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(QuestionTestCase)
    private readonly questionTestCaeRepository: Repository<QuestionTestCase>,
    private readonly logger: LogService,
  ) {}

  // Question stack
  async findOneQuestionStackById(stackId: string) {
    const queryResult = await this.questionStackRepository
      .findOne({
        where: {
          id: stackId,
        },
        relations: ['questions'],
      })
      .then((stack) => {
        if (!stack) return [null, 'Question Stack Is Not Found!'];
        return [stack, null];
      })
      .catch((err) => {
        this.logger.error(err);
        return [null, 'Cannot Get Question Stack!'];
      });

    return queryResult;
  }

  async findQuestionsStackByStatus(status: QuestionStackStatus) {
    const queryResult = await this.questionStackRepository
      .find({
        where: {
          status: status,
        },
      })
      .then((stacks) => [stacks, null])
      .catch((err) => {
        this.logger.error(err);
        return [null, 'Cannot Get Question Stacks!'];
      });

    return queryResult;
  }

  async createQuestionStack(dto: CreateQuestionStackDto) {
    try {
      let qs: QuestionStack = new QuestionStack();
      qs.name = dto.name;
      qs.stackMax = dto.stack_max;
      qs.status = dto.status;
      qs.type = dto.type;
      return [await this.questionStackRepository.save(qs), null];
    } catch (err) {
      this.logger.error(err);
      return [null, 'Cannot Create Question Stack!'];
    }
  }

  async updateQuestionStack(
    stack_id: string,
    updatedFields: UpdateQuestionStackDto,
  ) {
    let questionStack = await this.questionStackRepository.findOne({
      where: { id: stack_id },
      select: ['status'],
    });

    if (!questionStack) return [null, 'Not Found!'];

    if (questionStack.status !== QuestionStackStatus.USED) {
      const result = await this.questionStackRepository
        .update({ id: stack_id }, updatedFields)
        .then((_) => ['Updated Question Stack!', null])
        .catch((err) => {
          this.logger.error(err);
          return [null, 'Cannot Update The Question Stack!'];
        });

      return result;
    } else {
      return [null, 'Question Stack Is Used!'];
    }
  }

  async removeQuestionStackById(stack_id: string) {
    const questionStack = await this.questionStackRepository
      .findOne({
        where: { id: stack_id },
      })
      .then((questionStack) => {
        if (!questionStack) return null;
        return questionStack;
      })
      .catch((err) => this.logger.error(err));
    if (!questionStack) return [null, 'Question Stack Is Not Found!'];

    await this.questionRepository
      .delete({ stack: questionStack })
      .catch((err) => this.logger.error(err));

    await this.questionStackRepository
      .remove(questionStack)
      .catch((err) => this.logger.error(err));

    return ['Removed Question Stack!', null];
  }

  // Question
  async createQuestion(dto: CreateQuestionDto) {
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
      } else [null, 'Question Stack Is Not Found!'];
    } catch (err) {
      this.logger.error(err);
      return [null, 'Cannot Create Question!'];
    }
  }

  async findOneQuestionById(question_id: string) {
    const question = await this.questionRepository
      .findOne({
        where: { id: question_id },
        select: ['id'],
        relations: ['testCases'],
      })
      .then((question) => {
        if (!question) return [null, 'Question Is Not Found!'];
        return [question, null];
      })
      .catch((err) => {
        this.logger.error(err);
        return [null, 'Cannot Get The Question!'];
      });

    return question;
  }

  async updateQuestion(question_id: string, updateFields: UpdateQuestionDto) {
    const question = await this.questionRepository.findOne({
      where: { id: question_id },
    });
    if (!question) return [null, 'Question Is Not Found!'];

    if (updateFields.stack_id) {
      const questionStack = await this.questionStackRepository.findOne({
        where: { id: updateFields.stack_id },
      });

      if (!questionStack) return [null, 'Question Stack Is Not Found!'];

      question.stack = questionStack;
    }

    if (updateFields.score) question.score = updateFields.score;
    if (updateFields.maxSubmitTimes)
      question.maxSubmitTimes = updateFields.maxSubmitTimes;

    const result = await this.questionRepository
      .save(question)
      .then((_) => ['Updated Question!', null])
      .catch((err) => {
        this.logger.error(err);
        return [null, 'Cannot Update Question'];
      });

    return result;
  }

  async removeQuestionById(question_id: string) {
    const question = await this.questionRepository
      .findOne({
        where: { id: question_id },
      })
      .then((question) => {
        if (!question) return null;
        return question;
      })
      .catch((err) => this.logger.error(err));

    if (!question) return [null, 'Question Is Not Found!'];

    await this.questionTestCaeRepository
      .delete({ question: question })
      .catch((err) => this.logger.error(err));

    await this.questionRepository
      .remove(question)
      .catch((err) => this.logger.error(err));

    return [, null];
  }

  // Test case
  async findOneTestCaseById(testCase_id: number) {
    const queryResult = await this.questionTestCaeRepository
      .findOne({
        where: { id: testCase_id },
      })
      .then((testCase) => {
        if (!testCase) {
          return [null, 'Test Case Is Not Found!'];
        }

        return [testCase, null];
      })
      .catch((err) => {
        this.logger.error(err);
        return [null, 'Cannot Get Test Case!'];
      });

    return queryResult;
  }
  async findAllTestCaseByQuestion(question_id: string) {
    const question = await this.questionRepository
      .findOne({
        where: { id: question_id },
      })
      .then((question) => {
        if (!question) return null;
        return question;
      })
      .catch((err) => this.logger.error(err));
    if (!question) return [null, 'Question Is Not Found!'];

    const testCases = await this.questionTestCaeRepository
      .find({
        where: { question: question },
      })
      .then((testCase) => {
        if (!testCase) return null;
        return testCase;
      })
      .catch((err) => this.logger.error(err));

    return testCases;
  }

  async createTestCase(dto: CreateTestCaseDto) {
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
      } else return [null, 'Cannot found question'];
    } catch (err) {
      this.logger.error(err);
      return [null, 'Cannot Create Test Case!'];
    }
  }

  async updateTestCase(testCase_id: number, updatedFields: UpdateTestCaseDto) {
    const testCase = await this.questionTestCaeRepository
      .findOne({
        where: { id: testCase_id },
      })
      .then((testCase) => {
        if (!testCase) return null;
        return testCase;
      })
      .catch((err) => this.logger.error(err));

    if (!testCase) {
      return [null, 'Test Case Is Not Found!'];
    }

    testCase.input = updatedFields.input;
    testCase.output = updatedFields.output;

    await this.questionTestCaeRepository
      .save(testCase)
      .catch((err) => this.logger.error(err));

    return ['Updated Test Case!', null];
  }

  async removeTestCaseById(testCase_id: number) {
    const result = this.questionTestCaeRepository
      .delete({ id: testCase_id })
      .then((_) => ['Removed Test Case!', null])
      .catch((err) => {
        this.logger.error(err);
        return [null, 'Cannot Remove Test Case!'];
      });

    return result;
  }
}
