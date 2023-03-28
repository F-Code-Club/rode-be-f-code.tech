import { AccountsModule } from '@accounts/accounts.module';
import { AuthModule } from '@auth/auth.module';
import { Module } from '@nestjs/common';
import { SocketsGateWay } from './sockets.gateway';

@Module({
  imports: [AccountsModule, AuthModule],
  providers: [SocketsGateWay],
})
export class SocketsModule {}
