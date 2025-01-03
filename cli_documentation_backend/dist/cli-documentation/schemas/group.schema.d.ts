import { Schema } from 'mongoose';
import { groupDataInterface } from '../interfaces/group.interface';
export declare const GroupSchema: Schema<groupDataInterface, import("mongoose").Model<groupDataInterface, any, any, any, import("mongoose").Document<unknown, any, groupDataInterface> & groupDataInterface & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, groupDataInterface, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<groupDataInterface>> & import("mongoose").FlatRecord<groupDataInterface> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
