import { Schema } from 'mongoose';
import { groupDataInterface } from '../interfaces/group.interface';

export const GroupSchema = new Schema<groupDataInterface>({
  label: { type: String },
  icon: { type: String },
  url: { type: String },
  value: { type: String },
  link: { type: String },
  colorLabel: { type: String },
  registerAt: { type: Date, default: Date.now},
  commands: [{ type: Schema.Types.ObjectId, ref: "command_db" }]
});