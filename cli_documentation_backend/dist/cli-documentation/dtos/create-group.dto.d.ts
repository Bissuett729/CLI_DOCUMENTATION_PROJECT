import { Types } from 'mongoose';
export declare class CreateGroupDto {
    label: string;
    icon: string;
    url: string;
    value: string;
    colorLabel: string;
    link: string;
    commands?: Types.ObjectId[];
}
