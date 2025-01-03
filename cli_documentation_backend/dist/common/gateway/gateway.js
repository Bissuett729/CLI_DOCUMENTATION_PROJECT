"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let EventsGateway = class EventsGateway {
    afterInit() { }
    handleConnection(client, ...args) {
        console.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        console.log(`Client connected: ${client.id}`);
    }
    listenToEvent(channel, callback) {
        this.server.on(channel, callback);
    }
    disconnect() {
        this.server.disconnectSockets();
    }
    emitEvent(eventName, data) {
        console.log(`--------------| %%%%%%%%%%%% A SOCKET HAS BEEN ISSUED --> ${eventName} %%%%%%%%%%%% |---------------`);
        this.server.emit(eventName, data);
    }
    async emitEventTo(socketID, eventName, payload) {
        console.log(`--------------| %%%%%%%%%%%% A SOCKET HAS BEEN ISSUED FOR ${socketID} --> ${eventName} %%%%%%%%%%%% |---------------`);
        this.server.to(socketID).emit(eventName, payload);
    }
};
exports.EventsGateway = EventsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], EventsGateway.prototype, "server", void 0);
exports.EventsGateway = EventsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
            credentials: true,
        },
    })
], EventsGateway);
//# sourceMappingURL=gateway.js.map