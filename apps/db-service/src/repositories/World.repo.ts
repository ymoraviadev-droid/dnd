import { WorldModel } from "../models/Game/WorldModel.js";
import { BaseRepo } from "./Base.repo.js";

export class WorldRepo extends BaseRepo<WorldModel> {
    constructor() {
        super(WorldModel);
    }
}

export const worldRepo = new WorldRepo();
