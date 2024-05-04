import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { QuestionStack } from './entities/question-stack.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Question, QuestionStack])],
  controllers: [],
  providers: [],
  exports: [],
})
export class QuestionsModule {}
