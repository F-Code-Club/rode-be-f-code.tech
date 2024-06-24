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
import { TemplateService } from '@templates/templates.service';
@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(QuestionStack)
    private readonly questionStackRepository: Repository<QuestionStack>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(QuestionTestCase)
    private readonly questionTestCaseRepository: Repository<QuestionTestCase>,
    private readonly templatesService: TemplateService,
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
        this.logger.error('GET QUESION STACK: ' + err);
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
        this.logger.error('GET QUESTION STACK: ' + err);
        return [null, 'Cannot Get Question Stacks!'];
      });

    return queryResult;
  }

  async createQuestionStack(dto: CreateQuestionStackDto) {
    try {
      const stack = await this.questionStackRepository.save({
        name: dto.name,
        stackMax: dto.stackMax,
        status: QuestionStackStatus.DRAFT,
        type: dto.type,
      });
      return [stack, null];
    } catch (err) {
      this.logger.error('INSERT QUESTION STACK: ' + err);
      return [null, 'Cannot insert question stack'];
    }
  }

  async updateQuestionStack(
    stack_id: string,
    updatedFields: UpdateQuestionStackDto,
  ) {
    const questionStack = await this.questionStackRepository
      .findOne({
        where: { id: stack_id },
        select: ['status'],
      })
      .catch((err) => {
        this.logger.error('FIND STACK: ' + err);
      });

    if (!questionStack) return [null, 'Not Found!'];

    if (questionStack.status !== QuestionStackStatus.USED) {
      const result = await this.questionStackRepository
        .update({ id: stack_id }, updatedFields)
        .then(() => ['Updated Question Stack!', null])
        .catch((err) => {
          this.logger.error('UPDATE QUESTION STACK: ' + err);
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
      .catch((err) => this.logger.error('FIND STACK: ' + err));

    if (!questionStack) return [null, 'Question Stack Is Not Found!'];

    let error = null;

    const questions = await this.questionRepository
      .find({
        where: {
          stack: {
            id: stack_id,
          },
        },
      })
      .catch((err) => this.logger.error('FIND QUESTIONS: ' + err));

    if (questions) {
      for (const question of questions) {
        await this.templatesService.deleteOne(question.id);
      }
    }

    await this.questionStackRepository.remove(questionStack).catch((err) => {
      error = 'Cannot remove question stack';
      this.logger.error('REMOVE QUESTION STACK: ' + err);
    });

    if (error) return [null, error];
    return ['Removed Question Stack!', null];
  }

  // Question
  async createQuestion(stackId: string, dto: CreateQuestionDto) {
    const qs = await this.questionStackRepository
      .findOne({
        where: {
          id: stackId,
        },
      })
      .catch((err) => {
        this.logger.error('FIND STACK: ' + err);
      });

    if (!qs) return [null, 'Cannot found question_stack'];

    if (qs.status == QuestionStackStatus.USED)
      return [null, 'Question stack is USED!'];

    try {
      const question = await this.questionRepository.save({
        stack: qs,
        maxSubmitTimes: dto.maxSubmitTime,
        score: dto.score,
      });
      return [question, null];
    } catch (err) {
      this.logger.error('INSERT QUESTION: ' + err);
      return [null, 'Insert question fail'];
    }
  }

  async findOneQuestionById(question_id: string) {
    const question = await this.questionRepository
      .findOne({
        where: { id: question_id },
        select: ['id'],
        relations: ['testCases', 'template'],
      })
      .then((question) => {
        if (!question) return [null, 'Question Is Not Found!'];
        return [question, null];
      })
      .catch((err) => {
        this.logger.error('GET QUESTION: ' + err);
        return [null, 'Cannot Get The Question!'];
      });

    return question;
  }

  async updateQuestion(question_id: string, updateFields: UpdateQuestionDto) {
    const question = await this.questionRepository.findOne({
      where: { id: question_id },
    });
    if (!question) return [null, 'Question Is Not Found!'];

    if (updateFields.stackId) {
      const questionStack = await this.questionStackRepository.findOne({
        where: { id: updateFields.stackId },
      });

      if (!questionStack) return [null, 'Question Stack Is Not Found!'];

      question.stack = questionStack;
    }

    if (updateFields.score) question.score = updateFields.score;
    if (updateFields.maxSubmitTimes)
      question.maxSubmitTimes = updateFields.maxSubmitTimes;

    const result = await this.questionRepository
      .save(question)
      .then(() => ['Updated Question!', null])
      .catch((err) => {
        this.logger.error('UPDATE QUESTION: ' + err);
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
      .catch((err) => this.logger.error('GET QUESTION BY ID: ' + err));

    if (!question) return [null, 'Question Is Not Found!'];

    let error = null;

    await this.templatesService.deleteOne(question.id);

    if (!error) {
      await this.questionRepository.remove(question).catch((err) => {
        error = 'Cannot remove question';
        this.logger.error('REMOVE QUESTION: ' + err);
      });
    }

    if (error) return [null, error];
    return ['Remove question success', null];
  }

  // Test case
  async findOneTestCaseById(testCase_id: number) {
    const queryResult = await this.questionTestCaseRepository
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
        this.logger.error('GET TEST CASE: ' + err);
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
      .catch((err) => this.logger.error('GET QUESTION: ' + err));
    if (!question) return [null, 'Question Is Not Found!'];

    const testCases = await this.questionTestCaseRepository
      .find({
        where: { question: question },
      })
      .then((testCase) => {
        if (!testCase) return null;
        return testCase;
      })
      .catch((err) => this.logger.error('GET TEST CASES: ' + err));

    return testCases;
  }

  async createTestCase(questionId: string, dto: CreateTestCaseDto) {
    const question = await this.questionRepository
      .findOne({
        where: {
          id: questionId,
        },
      })
      .catch((err) => {
        this.logger.error('FIND QUESTION: ' + err);
      });

    if (!question) return [null, 'Cannot found question'];
    if (!question.stack) return [null, 'Cannot found question stack'];
    if (question.stack.status == QuestionStackStatus.USED)
      return [null, 'Question Stack is in USED'];
    try {
      const tc = await this.questionTestCaseRepository.save({
        question: question,
        input: dto.input,
        output: dto.output,
        isVisible: dto.isVisible,
      });
      return [tc, null];
    } catch (err) {
      this.logger.error('INSERT TEST CASE: ' + err.message);
      return [null, 'Cannot insert testcase'];
    }
  }

  async updateTestCase(testCase_id: number, updatedFields: UpdateTestCaseDto) {
    const testCase = await this.questionTestCaseRepository
      .findOne({
        where: { id: testCase_id },
      })
      .then((testCase) => {
        if (!testCase) return null;
        return testCase;
      })
      .catch((err) => this.logger.error('GET TEST CASE: ' + err));

    if (!testCase) {
      return [null, 'Test Case Is Not Found!'];
    }

    testCase.input = updatedFields.input;
    testCase.output = updatedFields.output;
    testCase.isVisible = updatedFields.isVisible;

    await this.questionTestCaseRepository
      .save(testCase)
      .catch((err) => this.logger.error('UPDATE TEST CASE: ' + err));

    return ['Updated Test Case!', null];
  }

  async removeTestCaseById(testCase_id: number) {
    const result = this.questionTestCaseRepository
      .delete({ id: testCase_id })
      .then(() => ['Removed Test Case!', null])
      .catch((err) => {
        this.logger.error('REMOVE TEST CASE: ' + err);
        return [null, 'Cannot Remove Test Case!'];
      });

    return result;
  }
}
