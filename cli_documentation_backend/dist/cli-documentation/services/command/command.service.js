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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandService = void 0;
const mongoose_1 = require("mongoose");
const common_1 = require("@nestjs/common");
const group_service_1 = require("./group.service");
const gateway_1 = require("../../../common/gateway/gateway");
const sockets_socket_1 = require("../../sockets/sockets.socket");
let CommandService = class CommandService {
    constructor(commandModel, _GroupService, _appGateway) {
        this.commandModel = commandModel;
        this._GroupService = _GroupService;
        this._appGateway = _appGateway;
    }
    async findAll() {
        try {
            return await this.commandModel.find().exec();
        }
        catch (error) {
            throw new common_1.HttpException('Error fetching commands', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async create(CreateCommandDto) {
        const createdCommand = new this.commandModel(CreateCommandDto);
        try {
            const savedCommand = await createdCommand.save();
            try {
                const updatedGroup = await this._GroupService.addCommand({
                    groupId: CreateCommandDto.groupId,
                    command: savedCommand._id,
                });
                this._appGateway.emitEvent(sockets_socket_1.commandSocket.create, {
                    ok: true,
                    data: { group: updatedGroup, command: savedCommand },
                    msg: "Socket Success!",
                });
                return savedCommand;
            }
            catch (groupError) {
                await this.commandModel.findByIdAndDelete(savedCommand._id);
                throw groupError;
            }
        }
        catch (error) {
            throw new common_1.HttpException('Error creating command', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteCommands(commandIds) {
        const session = await this.commandModel.db.startSession();
        session.startTransaction();
        try {
            const commands = await this.commandModel.find({ _id: { $in: commandIds } }).session(session);
            if (!commands.length) {
                throw new common_1.HttpException('No commands found for the provided IDs', common_1.HttpStatus.NOT_FOUND);
            }
            const groupIds = commands.map((command) => command.groupId);
            await this.commandModel.deleteMany({ _id: { $in: commandIds } }).session(session);
            const updatedGroups = await this._GroupService.removeCommandsFromGroups(groupIds, commandIds, session);
            await session.commitTransaction();
            session.endSession();
            this._appGateway.emitEvent(sockets_socket_1.commandSocket.delete, {
                ok: true,
                removedSuccess: true,
                msg: "Socket Success!",
            });
            return {
                deletedCommands: commandIds,
                updatedGroups,
            };
        }
        catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw new common_1.HttpException(`Error deleting commands: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getCommandsByGroupId(_id) {
        try {
            const commands = await this.commandModel.find({ groupId: _id }).exec();
            if (!commands || commands.length === 0) {
                throw new common_1.HttpException('No commands found for the given groupId', common_1.HttpStatus.NOT_FOUND);
            }
            return commands;
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Error fetching commands', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteCommandById(_id) {
        try {
            const result = await this.commandModel.deleteOne({ _id }).exec();
            if (result.deletedCount === 0) {
                throw new common_1.HttpException('Command not found', common_1.HttpStatus.NOT_FOUND);
            }
            this._appGateway.emitEvent(sockets_socket_1.commandSocket.delete, {
                ok: true,
                _id,
                msg: "Command delete succesfully",
            });
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Error deleting the command', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.CommandService = CommandService;
exports.CommandService = CommandService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('COMMAND_MODEL')),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => group_service_1.GroupService))),
    __metadata("design:paramtypes", [mongoose_1.Model,
        group_service_1.GroupService,
        gateway_1.EventsGateway])
], CommandService);
//# sourceMappingURL=command.service.js.map