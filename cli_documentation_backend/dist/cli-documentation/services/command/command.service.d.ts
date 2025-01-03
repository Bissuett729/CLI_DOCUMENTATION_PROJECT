import { Model, Types } from 'mongoose';
import { commandsDataInterface } from 'src/cli-documentation/interfaces/command.interface';
import { CreateCommandDto } from 'src/cli-documentation/dtos/create-command.dto';
import { GroupService } from './group.service';
import { EventsGateway } from 'src/common/gateway/gateway';
export declare class CommandService {
    private readonly commandModel;
    private readonly _GroupService;
    private readonly _appGateway;
    constructor(commandModel: Model<commandsDataInterface>, _GroupService: GroupService, _appGateway: EventsGateway);
    findAll(): Promise<commandsDataInterface[]>;
    create(CreateCommandDto: CreateCommandDto): Promise<commandsDataInterface>;
    deleteCommands(commandIds: Types.ObjectId[]): Promise<{
        deletedCommands: Types.ObjectId[];
        updatedGroups: Types.ObjectId[];
    }>;
    getCommandsByGroupId(_id: Types.ObjectId): Promise<commandsDataInterface[]>;
    deleteCommandById(_id: Types.ObjectId): Promise<void>;
}
