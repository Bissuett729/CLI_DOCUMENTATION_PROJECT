import { HttpStatus } from '@nestjs/common';
import { CreateGroupDto } from '../dtos/create-group.dto';
import { GroupService } from '../services/command/group.service';
export declare class GroupController {
    private readonly _GroupService;
    constructor(_GroupService: GroupService);
    findAll(): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("../interfaces/group.interface").groupDataInterface[];
    }>;
    create(CreateGroupDto: CreateGroupDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("../interfaces/group.interface").groupDataInterface;
    }>;
    delete(groupId: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: string;
    }>;
}
