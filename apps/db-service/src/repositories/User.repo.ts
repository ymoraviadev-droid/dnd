import { BaseRepo } from "./Base.repo.js";
import { UserModel } from "../models/Auth/UserModel.js";


export class UserRepo extends BaseRepo<UserModel> {
    constructor() {
        super(UserModel);
    }

    findByEmail(email: string) {
        return this.findOne({ email });
    }
}

export const userRepo = new UserRepo(); 
