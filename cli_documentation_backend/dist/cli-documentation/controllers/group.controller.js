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
exports.GroupController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const create_group_dto_1 = require("../dtos/create-group.dto");
const group_service_1 = require("../services/command/group.service");
const mongoose_1 = require("mongoose");
let GroupController = class GroupController {
    constructor(_GroupService) {
        this._GroupService = _GroupService;
    }
    async findAll() {
        try {
            const groups = await this._GroupService.findAll();
            return { statusCode: common_1.HttpStatus.OK, message: 'Groups retrieved successfully', data: groups };
        }
        catch (error) {
            throw new common_1.HttpException('Error fetching groups', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async create(CreateGroupDto) {
        try {
            const createdGroup = await this._GroupService.create(CreateGroupDto);
            return { statusCode: common_1.HttpStatus.CREATED, message: 'Group created successfully', data: createdGroup };
        }
        catch (error) {
            if (error.status === common_1.HttpStatus.BAD_REQUEST) {
                throw new common_1.HttpException('Invalid request payload', common_1.HttpStatus.BAD_REQUEST);
            }
            throw new common_1.HttpException('Error creating group', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async delete(groupId) {
        try {
            const deletedGroupId = await this._GroupService.deleteGroup(new mongoose_1.Types.ObjectId(groupId));
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Group deleted successfully',
                data: deletedGroupId,
            };
        }
        catch (error) {
            if (error.status === common_1.HttpStatus.NOT_FOUND) {
                throw new common_1.HttpException('Group not found', common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException('Error deleting group', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.GroupController = GroupController;
__decorate([
    (0, common_1.Get)('getAll'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successfully retrieved all groups.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error.',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('create'),
    (0, swagger_1.ApiBody)({
        description: 'Create a new group',
        type: create_group_dto_1.CreateGroupDto,
        examples: {
            createNewGroup: {
                value: {
                    label: 'Group Label',
                    icon: 'icon_url',
                    url: 'group_url',
                    value: 'group_value',
                    colorLabel: '#FFFFFF',
                    link: 'link of the documentation',
                    commands: [],
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Group successfully created.',
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
    __metadata("design:paramtypes", [create_group_dto_1.CreateGroupDto]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)('delete/:groupId'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Group deleted successfully.',
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
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "delete", null);
exports.GroupController = GroupController = __decorate([
    (0, common_1.Controller)('cli-documentation/v1/groups'),
    (0, swagger_1.ApiTags)("API's for group"),
    __metadata("design:paramtypes", [group_service_1.GroupService])
], GroupController);
//# sourceMappingURL=group.controller.js.map