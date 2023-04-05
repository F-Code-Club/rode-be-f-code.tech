import { AccountsModule } from '@accounts/accounts.module';
import { AccountsService } from '@accounts/accounts.service';
import { Account } from '@accounts/entities/account.entity';
import { Log } from '@logger/logger.decorator';
import { LogService } from '@logger/logger.service';
import {
  HttpException,
  HttpStatus,
  INestApplicationContext,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, Socket } from 'socket.io';

export class SocketIoAdapter extends IoAdapter {
  constructor(
    private app: INestApplicationContext,
    @Log('SocketsGateway') private readonly logger: LogService,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: any) {
    const server: Server = super.createIOServer(port, options);
    server.of('polls').use(async (socket: Socket, next) => {
      const token =
        socket.handshake?.auth?.token || socket.handshake?.headers['token'];
      this.logger.debug(
        '<createIOServer> validate authToken before connection: token ' + token,
      );
      if (!token) {
        return next(new Error('Token not provided'));
      }
      try {
        socket.data.account = {};
        const account: Account = await this.getAccountFromToken(token);
        socket.data.account = account;
        return next();
      } catch (error: any) {
        return next(new Error('Authentication error'));
      }
    });
    return server;
  }

  async getAccountFromToken(authToken: string): Promise<Account> {
    try {
      const jwtService = this.app.get(JwtService);
      const accountsService = this.app
        .select(AccountsModule)
        .get(AccountsService);
      const payload = jwtService.verify(authToken);
      this.logger.debug(
        '<getUserFromToken> payload: ' + JSON.stringify(payload),
      );

      return await accountsService.getById(payload.sub);
    } catch (ex) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }
}
