import { createContext, Dispatch, SetStateAction } from "react";
import { ICampaign, IPlayer } from "@dnd/types";

const gameContext = createContext<{
    selectedPlayer: IPlayer | null;
    setSelectedPlayer: Dispatch<SetStateAction<IPlayer | null>>;
    campaigns: ICampaign[];
    setCampaigns: Dispatch<SetStateAction<ICampaign[]>>;
    selectedCampaign: ICampaign | null;
    setSelectedCampaign: Dispatch<SetStateAction<ICampaign | null>>;
} | null>({
    selectedPlayer: null,
    setSelectedPlayer: () => { },
    campaigns: [],
    setCampaigns: () => { },
    selectedCampaign: null,
    setSelectedCampaign: () => { },
});

export default gameContext;
