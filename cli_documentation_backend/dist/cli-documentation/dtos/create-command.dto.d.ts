import { Types } from "mongoose";
export declare class CreateCommandDto {
    groupId: Types.ObjectId;
    command: string;
    description: string;
    includeExample: boolean;
    example: string;
}
