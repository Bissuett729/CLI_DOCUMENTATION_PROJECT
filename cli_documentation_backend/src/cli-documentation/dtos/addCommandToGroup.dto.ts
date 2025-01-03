import { Types } from "mongoose";

export class AddCommandToGroupDto {
    groupId: Types.ObjectId;
    command: Types.ObjectId;
  }
  