import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket as IOSocket, Server } from 'socket.io';
export declare class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    afterInit(): void;
    handleConnection(client: IOSocket, ...args: any[]): void;
    handleDisconnect(client: IOSocket): void;
    listenToEvent(channel: string, callback: (data: any) => void): void;
    disconnect(): void;
    emitEvent(eventName: string, data: any): void;
    emitEventTo(socketID: string, eventName: string, payload: any): Promise<void>;
}
