// import {
//   SubscribeMessage,
//   WebSocketGateway,
//   OnGatewayInit,
//   WebSocketServer,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
// } from '@nestjs/websockets';
// import { Logger } from '@nestjs/common';
// import { Socket, Server } from 'socket.io';

// @WebSocketGateway({ cors: true })
// export class SocketsGateWay
//   implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
// {
//   //constructor(private userSessionCache: UserSessionCache) {}

//   @WebSocketServer() server: Server;
//   private logger: Logger = new Logger('SocketsGateWay');

//   @SubscribeMessage('messages')
//   async messages(client: Socket, payload: MessagesInterface) {
//     // get all user trong conversation bằng conversation_id
//     const conversation = await this.conversationService.findById(
//       payload.conversation_id,
//       ['users'],
//     );

//     // get all socket id đã lưu trước đó của các user thuộc conversation
//     const dataSocketId = await this.deviceService.findSocketId(userId);

//     // Lưu dữ liệu vào bảng message
//     const message = await this.messageService.create({
//       user_id: payload.user_id,
//       status: false,
//       message: payload.message,
//       conversation_id: payload.conversation_id,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     });

//     //emit message đến socket_id
//     dataSocketId.map((value) => {
//       emit.to(value.value).emit('message-received', {
//         id: message.id,
//         message: message.message,
//         conversation_id: message.conversation_id,
//         user_id: message.user_id,
//         status: message.status,
//         createdAt: message.createdAt,
//         updatedAt: message.updatedAt,
//       });
//     });
//   }

//   async getDataUserFromToken(client: Socket): Promise<UserEntity> {
//     const authToken: any = client.handshake?.query?.token;
//     // try {
//     //   const decoded = this.jwtService.verify(authToken);

//     //   return await this.userService.getUserByEmail(decoded.email); // response to function
//     // } catch (ex) {
//     //   throw new HttpException('Not found', HttpStatus.NOT_FOUND);
//     // }
//   }

//   afterInit(server: Server) {
//     this.logger.log('Init');
//   }

//   handleDisconnect(client: Socket) {
//     this.logger.log(`Client disconnected: ${client.id}`);
//     // const user = await this.getDataUserFromToken(client);
//     // await this.deviceService.deleteByValue(user.id, client.id);

//     // // need handle remove socketId to table
//     // this.logger.log(client.id, 'Disconnect');

//     // await this.deviceService.create(information);
//   }

//   handleConnection(client: Socket) {
//     this.logger.log(`Client connected: ${client.id}`);
//     // const user: UserEntity = await this.getDataUserFromToken(client);

//     // const device = {
//     //   user_id: user.id,
//     //   type: TypeInformation.socket_id,
//     //   status: false,
//     //   value: client.id,
//     // };

//     // await this.deviceService.create(information);
//   }
// }
