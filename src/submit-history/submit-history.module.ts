import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubmitHistory } from './entities/submit-history.entity';
import { SubmitHistoryController } from './submit-history.controller';
import { SubmitHistoryService } from './submit-history.service';
import { Room } from '@rooms/entities/room.entity';
import { QuestionsModule } from '@questions/questions.module';
import { Score } from './entities/scores.entity';
import { Member } from '@teams/entities/member.entity';


@Module({
  imports: [TypeOrmModule.forFeature([SubmitHistory, Member, Room, Score]), QuestionsModule],
  controllers: [SubmitHistoryController],
  providers: [SubmitHistoryService],
  exports: [SubmitHistoryService],
})
export class SubmitHistoryModule {}
