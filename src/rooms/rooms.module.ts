import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { QuestionsModule } from '@questions/questions.module';
import { QuestionStack } from '@questions/entities/question-stack.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room, QuestionStack]), QuestionsModule],
  controllers: [RoomsController],
  providers: [RoomsService],
  exports: [RoomsService],
})
export class RoomsModule {}
