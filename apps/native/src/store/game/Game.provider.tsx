import { IPlayer } from "@dnd/types";
import gameContext from "./game.context";
import { useState } from "react";

const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedPlayer, setSelectedPlayer] = useState<IPlayer | null>(null);

  return (
    <gameContext.Provider
      value={{
        selectedPlayer,
        setSelectedPlayer,
      }}
    >
      {children}
    </gameContext.Provider>
  );
};

export default GameProvider;
