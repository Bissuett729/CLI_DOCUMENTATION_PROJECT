import { Schema } from 'mongoose';
import { commandsDataInterface } from '../interfaces/command.interface';
export declare const CommandSchema: Schema<commandsDataInterface, import("mongoose").Model<commandsDataInterface, any, any, any, import("mongoose").Document<unknown, any, commandsDataInterface> & commandsDataInterface & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, commandsDataInterface, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<commandsDataInterface>> & import("mongoose").FlatRecord<commandsDataInterface> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
