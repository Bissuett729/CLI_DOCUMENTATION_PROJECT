import { MongoConnectionService } from 'src/config/mongo-connection/mongo-connection.service';
import { commandsDataInterface } from '../interfaces/command.interface';
import { groupDataInterface } from '../interfaces/group.interface';
export declare const cliDocumentationProviders: ({
    provide: string;
    useFactory: (db: MongoConnectionService) => import("mongoose").Model<groupDataInterface, {}, {}, {}, import("mongoose").Document<unknown, {}, groupDataInterface> & groupDataInterface & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, any>;
    inject: (typeof MongoConnectionService)[];
} | {
    provide: string;
    useFactory: (db: MongoConnectionService) => import("mongoose").Model<commandsDataInterface, {}, {}, {}, import("mongoose").Document<unknown, {}, commandsDataInterface> & commandsDataInterface & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, any>;
    inject: (typeof MongoConnectionService)[];
})[];
