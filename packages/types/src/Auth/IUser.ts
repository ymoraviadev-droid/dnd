import { DbRecord } from "../private/DbRecord.js";

export interface IUser extends DbRecord {
    email: string;
    name: string;
    password: string;
}
