import { createContext, Dispatch, SetStateAction } from "react";
import { IPlayer } from "@dnd/types";

const gameContext = createContext<{
    selectedPlayer: IPlayer | null;
    setSelectedPlayer: Dispatch<SetStateAction<IPlayer | null>>;
    players: IPlayer[];
    setPlayers: Dispatch<SetStateAction<IPlayer[]>>;
} | null>({
    selectedPlayer: null,
    setSelectedPlayer: () => { },
    players: [],
    setPlayers: () => { }
});

export default gameContext;
