import { ICampaign, IPlayer } from "@dnd/types";
import gameContext from "./game.context";
import { useState } from "react";

const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedPlayer, setSelectedPlayer] = useState<IPlayer | null>(null);
  const [campaigns, setCampaigns] = useState<ICampaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<ICampaign | null>(null);

  return (
    <gameContext.Provider
      value={{
        selectedPlayer,
        setSelectedPlayer,
        campaigns,
        setCampaigns,
        selectedCampaign,
        setSelectedCampaign,
      }}
    >
      {children}
    </gameContext.Provider>
  );
};

export default GameProvider;
