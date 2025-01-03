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
exports.CommandController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const command_service_1 = require("../services/command/command.service");
const create_command_dto_1 = require("../dtos/create-command.dto");
const mongoose_1 = require("mongoose");
let CommandController = class CommandController {
    constructor(_CommandService) {
        this._CommandService = _CommandService;
    }
    async findAll() {
        try {
            const commands = await this._CommandService.findAll();
            return { statusCode: common_1.HttpStatus.OK, message: 'Commands retrieved successfully', data: commands };
        }
        catch (error) {
            throw new common_1.HttpException('Error fetching commands', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findByGroupId(groupId) {
        return await this._CommandService.getCommandsByGroupId(groupId);
    }
    async create(CreateCommandDto) {
        try {
            const createdCommand = await this._CommandService.create(CreateCommandDto);
            return { statusCode: common_1.HttpStatus.CREATED, message: 'Command created successfully', data: createdCommand };
        }
        catch (error) {
            if (error.status === common_1.HttpStatus.BAD_REQUEST) {
                throw new common_1.HttpException('Invalid request payload', common_1.HttpStatus.BAD_REQUEST);
            }
            throw new common_1.HttpException('Error creating command', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteCommands(commandIds) {
        try {
            const result = await this._CommandService.deleteCommands(commandIds);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Commands deleted successfully',
                data: result,
            };
        }
        catch (error) {
            throw new common_1.HttpException('Error deleting commands', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteCommand(_id) {
        try {
            await this._CommandService.deleteCommandById(_id);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: `Command ${_id} deleted successfully`,
            };
        }
        catch (error) {
            throw new common_1.HttpException('Error deleting command', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.CommandController = CommandController;
__decorate([
    (0, common_1.Get)('getAll'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successfully retrieved all commands.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error.',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CommandController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('getByGroupId/:groupId'),
    (0, swagger_1.ApiParam)({
        name: 'groupId',
        type: String,
        description: 'Its a mongo ID',
        required: true,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successfully retrieved commands for the group.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Group not found.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error.',
    }),
    __param(0, (0, common_1.Param)('groupId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], CommandController.prototype, "findByGroupId", null);
__decorate([
    (0, common_1.Post)('create'),
    (0, swagger_1.ApiBody)({
        description: 'Create a new command',
        type: create_command_dto_1.CreateCommandDto,
        examples: {
            createNewCommand: {
                value: {
                    groupId: 'group123',
                    command: 'exampleCommand',
                    description: 'A sample command',
                    includeExample: true,
                    example: 'Sample Example',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Command successfully created.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid request payload.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error.',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_command_dto_1.CreateCommandDto]),
    __metadata("design:returntype", Promise)
], CommandController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)('delete'),
    (0, swagger_1.ApiBody)({
        description: 'Delete multiple commands and remove their references from groups',
        schema: {
            type: 'object',
            properties: {
                commandIds: {
                    type: 'array',
                    items: { type: 'string' },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Commands deleted successfully.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid request payload.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error.',
    }),
    __param(0, (0, common_1.Body)('commandIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], CommandController.prototype, "deleteCommands", null);
__decorate([
    (0, common_1.Delete)('delete-command/:_id'),
    (0, swagger_1.ApiParam)({
        name: '_id',
        type: String,
        description: 'Its a mongo ID',
        required: true,
    }),
    __param(0, (0, common_1.Param)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], CommandController.prototype, "deleteCommand", null);
exports.CommandController = CommandController = __decorate([
    (0, common_1.Controller)('cli-documentation/v1/commands'),
    (0, swagger_1.ApiTags)("API's for commands"),
    __metadata("design:paramtypes", [command_service_1.CommandService])
], CommandController);
//# sourceMappingURL=command.controller.js.map