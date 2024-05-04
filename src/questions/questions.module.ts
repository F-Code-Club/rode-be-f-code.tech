import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { QuestionStack } from './entities/question-stack.entity';
import { QuestionController } from './questions.controller';
import { QuestionService } from './questions.service';
import { QuestionTestCase } from './entities/question-test-case.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question, QuestionStack, QuestionTestCase]),
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: [QuestionService],
})
export class QuestionsModule {}
