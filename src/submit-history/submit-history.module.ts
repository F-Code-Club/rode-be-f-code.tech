import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubmitHistory } from './entities/submit-history.entity';
import { SubmitHistoryController } from './submit-history.controller';
import { SubmitHistoryService } from './submit-history.service';
import { Room } from '@rooms/entities/room.entity';
import { Account } from '@accounts/entities/account.entity';
import { Question } from '@rooms/entities/question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubmitHistory, Account, Room, Question])],
  controllers: [SubmitHistoryController],
  providers: [SubmitHistoryService],
  exports: [SubmitHistoryService],
})
export class SubmitHistoryModule {}
