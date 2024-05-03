import { Inject, Module } from '@nestjs/common';
import { ScoringService } from './scoring.service';
import { ScoringController } from './scoring.controller';
import { RoomsModule } from '../rooms/rooms.module';
import * as path from 'path';
import * as fs from 'fs';
import { C_CPPService } from './compile-and-execute-services/c_cpp.service';
import { JavaService } from './compile-and-execute-services/java.service';
import { PixelMatchService } from './pixel-match.service';
import { LocalFilesModule } from 'templates/local-files.module';
import { SubmitHistoryService } from 'submit-history/submit-history.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubmitHistory } from 'submit-history/entities/submit-history.entity';
import { Room } from '@rooms/entities/room.entity';
import { Question } from '@rooms/entities/question.entity';
import { Account } from '@accounts/entities/account.entity';
import { UserRoom } from 'user-rooms/entities/user-room.entity';
import { UserRoomsModule } from 'user-rooms/user-rooms.module';
import { GoogleApiModule } from 'google-api/google-api.module';

@Module({
  controllers: [ScoringController],
  providers: [
    {
      provide: 'SCORING_PATH',
      useValue: path.resolve(__dirname + '/../../scoring'),
    },
    ScoringService,
    C_CPPService,
    JavaService,
    PixelMatchService,
    SubmitHistoryService,
  ],
  imports: [
    RoomsModule,
    LocalFilesModule,
    UserRoomsModule,
    GoogleApiModule,
    TypeOrmModule.forFeature([
      SubmitHistory,
      Room,
      Question,
      Account,
      UserRoom,
    ]),
  ],
})
export class ScoringModule {
  constructor(@Inject('SCORING_PATH') private scoringPath: string) {}

  onModuleInit() {
    if (!fs.existsSync(this.scoringPath)) {
      fs.mkdirSync(this.scoringPath);
    }
  }
}
