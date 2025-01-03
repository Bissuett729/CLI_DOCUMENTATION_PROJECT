import {
    WebSocketGateway,
    OnGatewayInit,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Socket as IOSocket, Server } from 'socket.io';
  @WebSocketGateway({
    cors: {
      origin: '*',
      credentials: true,
    },
  })
  export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  
    @WebSocketServer() server: Server;
  
    afterInit() {}
  
    handleConnection(client: IOSocket, ...args: any[]) {
      console.log(`Client connected: ${client.id}`);
    }
  
    handleDisconnect(client: IOSocket) {
      console.log(`Client connected: ${client.id}`);
    }
  
    listenToEvent(channel: string, callback: (data: any) => void): void {
      this.server.on(channel, callback)
    }
  
    disconnect():void {
      this.server.disconnectSockets();
    }
  
    emitEvent(eventName: string, data: any): void {
      console.log(`--------------| %%%%%%%%%%%% A SOCKET HAS BEEN ISSUED --> ${eventName} %%%%%%%%%%%% |---------------`);
      this.server.emit(eventName, data);
    }
  
    public async emitEventTo(socketID: string, eventName: string, payload: any) {
      console.log(`--------------| %%%%%%%%%%%% A SOCKET HAS BEEN ISSUED FOR ${socketID} --> ${eventName} %%%%%%%%%%%% |---------------`);
      this.server.to(socketID).emit(eventName, payload)
    }
  
   
  }
  