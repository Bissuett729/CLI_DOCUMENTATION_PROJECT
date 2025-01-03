import { Schema } from 'mongoose';
import { commandsDataInterface } from '../interfaces/command.interface';

export const CommandSchema = new Schema<commandsDataInterface>({
  groupId: { type: Schema.Types.ObjectId },
  command: { type: String },
  description: { type: String },
  includeExample: { type: Boolean },
  example: { type: String },
  registerAt: { type: Date, default: Date.now}
});