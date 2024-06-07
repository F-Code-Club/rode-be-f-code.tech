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
      .catch((_) => [null, 'Cannot Get Question Stack!']);

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
      .catch((_) => [null, 'Cannot Get Question Stacks!']);

    return queryResult;
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
    return [null, 'Cannot Create Question Stack!'];
  }

  async updateQuestionStack(
    stack_id: string,
    updatedFields: UpdateQuestionStackDto,
  ) {
    let questionStack = await this.questionStackRepository.findOne({
      where: { id: stack_id },
      select: ['id', 'name', 'status', 'type', 'stackMax'],
    });

    if (
      questionStack.stackMax === updatedFields.stack_max ||
      questionStack.name === updatedFields.name ||
      questionStack.status === updatedFields.status ||
      questionStack.type === updatedFields.type
    ) {
      return [null, 'Your Change Is The Same With Previous Version!'];
    }

    if (!questionStack) return [null, 'Not Found!'];

    if (questionStack.status !== QuestionStackStatus.USED) {
      const result = await this.questionStackRepository
        .update({ id: stack_id }, updatedFields)
        .then((result) => [result, null])
        .catch((_) => [null, 'Cannot Update The Question Stack!']);

      return result;
    } else {
      return [null, 'Question Stack Is Used!'];
    }
  }

  // Question
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
      .catch((_) => [null, 'Cannot Get The Question!']);

    return question;
  }
  async findAllQuestion() {}

  async updateQuestion(question_id: string, updateFields: UpdateQuestionDto) {
    const question = await this.questionRepository.findOne({
      where: { id: question_id },
    });
    if (!question) return [null, 'Question Is Not Found!'];

    if (
      question.id === updateFields.stack_id ||
      question.score === updateFields.score ||
      question.maxSubmitTimes === updateFields.maxSubmitTimes
    ) {
      return [null, 'Your Change Is The Same With Previous Version!'];
    }

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

    return [await this.questionRepository.save(question), null];
  }

  // Test case
  async findOneTestCaseById(question_id: string, testCase_id: number) {
    const question = await this.questionRepository.findOne({
      where: { id: question_id },
    });
    if (!question) return [null, 'Question Is Not Found!'];

    const queryResult = await this.questionTestCaeRepository
      .findOne({
        where: { id: testCase_id, question: question },
      })
      .then((testCase) => {
        if (!testCase) {
          return [null, 'Test Case Is Not Found!'];
        }

        return [testCase, null];
      })
      .catch((_) => [null, 'Cannot Get Test Case!']);

    return queryResult;
  }
  async findAllTestCase() {}

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

  async updateTestCase(
    question_id: string,
    testCase_id: number,
    updatedFields: UpdateTestCaseDto,
  ) {
    const question = await this.questionRepository.findOne({
      where: { id: question_id },
    });
    if (!question) return [null, 'Question Is Not Found!'];

    const testCase = await this.questionTestCaeRepository.findOne({
      where: { id: testCase_id, question: question },
    });

    if (!testCase) {
      return [null, 'Test Case Is Not Found!'];
    }

    if (
      testCase.input === updatedFields.input ||
      testCase.output === updatedFields.output
    ) {
      return [null, 'Your Change Is The Same With Previous Version!'];
    }

    if (updatedFields.input) {
      testCase.input = updatedFields.input;
    }
    if (updatedFields.output) {
      testCase.output = updatedFields.output;
    }

    return [await this.questionTestCaeRepository.save(testCase), null];
  }
}
