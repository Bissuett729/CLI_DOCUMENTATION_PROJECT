import { HttpStatus } from '@nestjs/common';
import { CommandService } from '../services/command/command.service';
import { CreateCommandDto } from '../dtos/create-command.dto';
import { Types } from 'mongoose';
export declare class CommandController {
    private readonly _CommandService;
    constructor(_CommandService: CommandService);
    findAll(): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("../interfaces/command.interface").commandsDataInterface[];
    }>;
    findByGroupId(groupId: Types.ObjectId): Promise<import("../interfaces/command.interface").commandsDataInterface[]>;
    create(CreateCommandDto: CreateCommandDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("../interfaces/command.interface").commandsDataInterface;
    }>;
    deleteCommands(commandIds: Types.ObjectId[]): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            deletedCommands: Types.ObjectId[];
            updatedGroups: Types.ObjectId[];
        };
    }>;
    deleteCommand(_id: Types.ObjectId): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
}
