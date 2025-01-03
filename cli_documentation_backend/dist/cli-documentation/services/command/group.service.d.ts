import { Model, Types } from 'mongoose';
import { groupDataInterface } from 'src/cli-documentation/interfaces/group.interface';
import { CreateGroupDto } from 'src/cli-documentation/dtos/create-group.dto';
import { AddCommandToGroupDto } from 'src/cli-documentation/dtos/addCommandToGroup.dto';
import { ClientSession } from 'mongoose';
import { CommandService } from './command.service';
import { EventsGateway } from 'src/common/gateway/gateway';
export declare class GroupService {
    private readonly groupModel;
    private readonly _CommandService;
    private readonly _appGateway;
    constructor(groupModel: Model<groupDataInterface>, _CommandService: CommandService, _appGateway: EventsGateway);
    findAll(): Promise<groupDataInterface[]>;
    create(CreateGroupDto: CreateGroupDto): Promise<groupDataInterface>;
    addCommand(payload: AddCommandToGroupDto): Promise<groupDataInterface>;
    removeCommandsFromGroups(groupIds: Types.ObjectId[], commandIds: Types.ObjectId[], session: ClientSession): Promise<Types.ObjectId[]>;
    deleteGroup(groupId: Types.ObjectId): Promise<string>;
}
