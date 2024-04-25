import { MiddlewareConsumer, Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { AccountsModule } from './accounts/accounts.module';
import { HttpModule } from '@nestjs/axios';
import { RoomsModule } from './rooms/rooms.module';
import { LocalFilesModule } from './local-files/local-files.module';
import { ScoringModule } from './scoring/scoring.module';
import { UserRoomsModule } from './user-rooms/user-rooms.module';
import { LogModule } from './logger/logger.module';
import LoggerMiddleware from './etc/logger.middleware';
import { SubmitHistoryModule } from 'submit-history/submit-history.module';
import { SocketsModule } from 'sockets/sockets.module';
import { GoogleApiModule } from './google-api/google-api.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    LogModule.forRoot(),
    HttpModule,
    DatabaseModule,
    AuthModule,
    AccountsModule,
    RoomsModule,
    LocalFilesModule,
    ScoringModule,
    UserRoomsModule,
    SubmitHistoryModule,
    SocketsModule,
    GoogleApiModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
