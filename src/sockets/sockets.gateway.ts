import {
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Namespace } from 'socket.io';
import { Account } from '@accounts/entities/account.entity';
import { Log } from '@logger/logger.decorator';
import { LogService } from '@logger/logger.service';
import { AccountsService } from '@accounts/accounts.service';

@WebSocketGateway({ namespace: 'polls', cors: true })
export class SocketsGateWay
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @Log('SocketsGateway') private readonly logger: LogService,
    private readonly accountsService: AccountsService,
  ) {}

  @WebSocketServer() io: Namespace;

  afterInit() {
    this.logger.log('Init SocketsGateway');
  }

  async handleDisconnect(client: Socket) {
    const sockets = this.io.sockets;
    const account: Account = client.data.account;
    if (account) {
      this.logger.log(`Client disconnected: ${client.id}  - ${account.email}`);
      this.logger.debug(`Number of clients: ${sockets.size}`);
      //Update status isLoggedIn = false
      await this.accountsService.updateLoggedIn(account.id, false);
    }
  }

  async handleConnection(client: Socket) {
    const sockets = this.io.sockets;
    const account: Account = client.data.account;
    this.logger.log(`Client connected: ${client.id} - ${account.email}`);
    this.logger.debug(`Number of clients: ${sockets.size}`);
    //Update status isLoggedIn = true
    const [result, error] = await this.accountsService.updateLoggedIn(
      account.id,
      true,
    );
    if (!result) {
      this.io.to(client.id).emit('error', { message: error.toString() });
      this.logger.error(error.toString());
      client.data.account = null;
      client.disconnect();
      return new Error(error.toString());
    }
    this.io.to(client.id).emit('connected', { message: 'Logged in' });
  }
}
