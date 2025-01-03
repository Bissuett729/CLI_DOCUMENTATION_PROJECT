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
exports.GroupService = void 0;
const mongoose_1 = require("mongoose");
const common_1 = require("@nestjs/common");
const command_service_1 = require("./command.service");
const sockets_socket_1 = require("../../sockets/sockets.socket");
const gateway_1 = require("../../../common/gateway/gateway");
let GroupService = class GroupService {
    constructor(groupModel, _CommandService, _appGateway) {
        this.groupModel = groupModel;
        this._CommandService = _CommandService;
        this._appGateway = _appGateway;
    }
    async findAll() {
        try {
            const groups = await this.groupModel.find().exec();
            return groups;
        }
        catch (error) {
            throw new common_1.HttpException('Error fetching groups', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async create(CreateGroupDto) {
        try {
            const createdGroup = new this.groupModel(CreateGroupDto);
            const savedGroup = await createdGroup.save();
            this._appGateway.emitEvent(sockets_socket_1.groupSocket.create, {
                ok: true,
                data: savedGroup,
                msg: "Socket Success!",
            });
            return savedGroup;
        }
        catch (error) {
            throw new common_1.HttpException('Error creating group', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async addCommand(payload) {
        try {
            const instanceGroup = await this.groupModel.findById(payload.groupId);
            if (!instanceGroup) {
                throw new common_1.HttpException('Group not found', common_1.HttpStatus.NOT_FOUND);
            }
            if (instanceGroup.commands.includes(payload.command)) {
                throw new common_1.HttpException('Command already exists in group', common_1.HttpStatus.CONFLICT);
            }
            instanceGroup.commands.push(payload.command);
            await instanceGroup.save();
            return instanceGroup.toObject();
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Error adding command to group', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async removeCommandsFromGroups(groupIds, commandIds, session) {
        try {
            const result = await this.groupModel.updateMany({ _id: { $in: groupIds } }, { $pull: { commands: { $in: commandIds } } }, { session });
            if (result.modifiedCount === 0) {
                throw new common_1.HttpException('No groups were updated', common_1.HttpStatus.NOT_FOUND);
            }
            return groupIds;
        }
        catch (error) {
            throw new common_1.HttpException(`Error updating groups: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteGroup(groupId) {
        const session = await this.groupModel.db.startSession();
        session.startTransaction();
        try {
            const group = await this.groupModel.findById(groupId).session(session);
            if (!group) {
                throw new common_1.HttpException('Group not found', common_1.HttpStatus.NOT_FOUND);
            }
            for (const commandId of group.commands) {
                try {
                    await this._CommandService.deleteCommandById(commandId);
                }
                catch (commandError) {
                    throw new common_1.HttpException('Error deleting associated command', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }
            await this.groupModel.findByIdAndDelete(groupId).session(session);
            await session.commitTransaction();
            this._appGateway.emitEvent(sockets_socket_1.groupSocket.delete, {
                ok: true,
                removedSuccess: true,
                msg: "Socket Success!",
            });
            return groupId.toString();
        }
        catch (error) {
            await session.abortTransaction();
            throw new common_1.HttpException('Error deleting group and its commands', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        finally {
            session.endSession();
        }
    }
};
exports.GroupService = GroupService;
exports.GroupService = GroupService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('GROUP_MODEL')),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => command_service_1.CommandService))),
    __metadata("design:paramtypes", [mongoose_1.Model,
        command_service_1.CommandService,
        gateway_1.EventsGateway])
], GroupService);
//# sourceMappingURL=group.service.js.map