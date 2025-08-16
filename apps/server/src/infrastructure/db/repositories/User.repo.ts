import { Transaction, CreationAttributes } from "sequelize";
import { hashPassword } from "../../../utils/hash.js";
import { BaseRepo } from "./Base.repo.js";
import { UserSchema } from "../models/Auth/UserSchema.js";


export class UserRepo extends BaseRepo<UserSchema> {
    constructor() {
        super(UserSchema);
    }

    findByEmail(email: string) {
        return this.findOne({ email });
    }

    async create(
        data: CreationAttributes<UserSchema> & { password: string },
        tx?: Transaction
    ): Promise<UserSchema> {
        const passwordHash = await hashPassword(data.password);
        const toCreate = { ...data, password: passwordHash };
        return super.create(toCreate as CreationAttributes<UserSchema>, tx);
    }
}

export const userRepo = new UserRepo(); 
