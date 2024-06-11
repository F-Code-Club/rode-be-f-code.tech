import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { QuestionStack } from '@questions/entities/question-stack.entity';
import { Team } from '@teams/entities/team.entity';
import { Score } from 'scores/entities/scores.entity';
import { LogService } from '@logger/logger.service';
import { LogModule } from '@logger/logger.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room, QuestionStack, Team, Score]),
    LogModule,
  ],
  controllers: [RoomsController],
  providers: [RoomsService, LogService],
  exports: [RoomsService],
})
export class RoomsModule {}
