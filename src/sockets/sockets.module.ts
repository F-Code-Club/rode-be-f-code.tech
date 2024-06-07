import { AccountsModule } from '@accounts/accounts.module';
import { AuthModule } from '@auth/auth.module';
import { Module } from '@nestjs/common';
import { SocketsGateWay } from './sockets.gateway';
import { RoomsModule } from '@rooms/rooms.module';
import { ScoresModule } from 'scores/scores.module';

@Module({
  imports: [AccountsModule, AuthModule, RoomsModule, ScoresModule],
  providers: [SocketsGateWay],
})
export class SocketsModule {}
