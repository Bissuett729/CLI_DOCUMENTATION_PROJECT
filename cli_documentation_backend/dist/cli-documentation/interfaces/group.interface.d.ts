import { Types } from "mongoose";
export interface groupDataInterface {
    _id?: Types.ObjectId;
    label: string;
    icon: string;
    url: string;
    value: string;
    link: string;
    colorLabel: string;
    registerAt: Date;
    commands: Types.ObjectId[];
}
