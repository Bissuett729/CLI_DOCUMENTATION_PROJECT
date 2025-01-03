import { Types } from 'mongoose';

export class CreateGroupDto {
  label: string;
  icon: string;
  url: string;
  value: string;
  colorLabel: string;
  link: string;
  commands?: Types.ObjectId[];
}
