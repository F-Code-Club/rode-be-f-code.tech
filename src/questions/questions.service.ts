import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionStack } from './entities/question-stack.entity';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { QuestionStackStatus } from '@etc/enums';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(QuestionStack)
    private readonly questionStackRepository: Repository<QuestionStack>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  async findQuestionStackById(stackId: string) {
    const quetyResult = await this.questionStackRepository.findOne({
      where: {
        id: stackId,
        status: QuestionStackStatus.ACTIVE,
      },
    });
  }
}
