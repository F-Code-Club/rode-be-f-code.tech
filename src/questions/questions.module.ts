import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { QuestionStack } from './entities/question-stack.entity';
import { QuestionController } from './questions.controller';
import { QuestionService } from './questions.service';
import { QuestionTestCase } from './entities/question-test-case.entity';
import { LogModule } from '@logger/logger.module';
import { LogService } from '@logger/logger.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question, QuestionStack, QuestionTestCase]),
    LogModule,
  ],
  controllers: [QuestionController],
  providers: [QuestionService, LogService],
  exports: [QuestionService],
})
export class QuestionsModule {}
