import { createContext, Dispatch, SetStateAction } from "react";
import { IPlayer } from "@dnd/types";

const gameContext = createContext<{
    selectedPlayer: IPlayer | null;
    setSelectedPlayer: Dispatch<SetStateAction<IPlayer | null>>;
} | null>({
    selectedPlayer: null,
    setSelectedPlayer: () => { },
});

export default gameContext;
