import { MiddlewareConsumer, Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { AccountsModule } from './accounts/accounts.module';
import { HttpModule } from '@nestjs/axios';
import { RoomsModule } from './rooms/rooms.module';
import { TemplateModule } from './templates/templates.module';
import { ScoringModule } from './scoring/scoring.module';
import { LogModule } from './logger/logger.module';
import LoggerMiddleware from './etc/logger.middleware';
import { SubmitHistoryModule } from 'submit-history/submit-history.module';
import { SocketsModule } from 'sockets/sockets.module';
import { GoogleApiModule } from './google-api/google-api.module';
import { QuestionsModule } from '@questions/questions.module';
import { TeamsModule } from '@teams/teams.module';

@Module({
  imports: [
    LogModule.forRoot(),
    HttpModule,
    AccountsModule,
    AuthModule,
    DatabaseModule,
    QuestionsModule,
    RoomsModule,
    ScoringModule,
    TemplateModule,
    ScoringModule,
    SocketsModule,
    SubmitHistoryModule,
    TeamsModule,
    TemplateModule,
    GoogleApiModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
