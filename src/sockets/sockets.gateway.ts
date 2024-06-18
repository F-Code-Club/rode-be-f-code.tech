import {
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Socket, Namespace } from 'socket.io';
import { Account } from '@accounts/entities/account.entity';
import { Log } from '@logger/logger.decorator';
import { LogService } from '@logger/logger.service';
import { AccountsService } from '@accounts/accounts.service';
import { ViewLeaderboardDto } from './dtos/view-leaderboard.dto';
import { content } from 'googleapis/build/src/apis/content';
import { RoomsService } from '@rooms/rooms.service';
import { ScoresService } from 'scores/scores.service';

@WebSocketGateway({ namespace: 'polls', cors: true })
export class SocketsGateWay
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @Log('SocketsGateway') private readonly logger: LogService,
    private readonly accountsService: AccountsService,
    private readonly roomsService: RoomsService,
    private readonly scoresService: ScoresService,
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
    // const [result, error] = await this.accountsService.updateLoggedIn(
    //   account.id,
    //   true,
    // );
    // if (!result) {
    //   this.io.to(client.id).emit('error', { message: error.toString() });
    //   this.logger.error(error.toString());
    //   client.data.account = null;
    //   client.disconnect();
    //   return new Error(error.toString());
    // }
    this.io.to(client.id).emit('connected', { message: 'Connected' });
  }

  @SubscribeMessage('join-room')
  async joinRoom(client: Socket, dto: ViewLeaderboardDto) {
    this.roomsService
      .isNotOneHourLeft(dto.roomId)
      .then((result) => {
        if (result) {
          client.join(dto.roomId.toString());
          client.emit(`Join room ${dto.roomId} successful`);
        }
      })
      .catch((error) => this.logger.error('GET ROOMS ERROR: ' + error));
  }

  @SubscribeMessage('leave-room')
  async leaveRoom(client: Socket, dto: ViewLeaderboardDto) {
    this.roomsService
      .findOneById(dto.roomId)
      .then(([data, err]) => {
        if (data) {
          client.leave(dto.roomId.toString());
          client.emit(`Leave room ${dto.roomId} successful`);
        }
      })
      .catch((error) => this.logger.error('GET ROOMS ERROR: ' + error));
  }

  @SubscribeMessage('change-leaderboard')
  async changeLeaderboard(@MessageBody() dto: ViewLeaderboardDto) {
    // Find if it is one hour left
    this.roomsService
      .isNotOneHourLeft(dto.roomId)
      .then(async (result) => {
        if (result) {
          const [data, error] = await this.scoresService.getLeaderboard(
            dto.roomId,
          );
          this.io
            .to(dto.roomId.toString())
            .emit('on-view-leaderboard', { data, error });
          if (error) this.logger.error('GET SCORES ERROR: ' + error);
        } else {
          this.io.to(dto.roomId.toString()).emit('on-view-leaderboard', {
            data: null,
            error: 'Time remaining is less than 1 hour.',
          });
          this.logger.error(
            'ROOMS TIME ERROR: Time remaining is less than 1 hour.',
          );
        }
      })
      .catch((error) => this.logger.error('GET ROOMS ERROR: ' + error));
  }
}
