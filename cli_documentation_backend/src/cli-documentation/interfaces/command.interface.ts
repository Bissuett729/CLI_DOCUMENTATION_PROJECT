import { Types } from 'mongoose';

export interface commandsDataInterface {
  _id?: Types.ObjectId,
  groupId: Types.ObjectId;
  command: string;
  description: string;
  includeExample: boolean;
  example: string;
  registerAt: Date;
}
