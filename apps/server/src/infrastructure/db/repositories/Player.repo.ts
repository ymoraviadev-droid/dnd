import { BaseRepo } from "./Base.repo.js";
import { PlayerModel } from "../models/Game/PlayerModel.js";


export class PlayerRepo extends BaseRepo<PlayerModel> {
    constructor() {
        super(PlayerModel);
    }
}

export const playerRepo = new PlayerRepo();
