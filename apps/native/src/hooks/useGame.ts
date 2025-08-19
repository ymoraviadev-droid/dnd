import { useCallback, useContext } from "react";
import gameContext from "../store/game/game.context";
import useAuth from "./useAuth";
import { sendApiRequest } from "../utils/sendApiRequest";
import { IPlayer } from "@dnd/types";
import { PixelToast } from "../components/PixelToast";
import { CreateCampaignInput } from "@dnd/zod-schemas";
import { router } from "expo-router";

const useGame = () => {
    const { players, setPlayers } = useAuth();
    const context = useContext(gameContext);
    const { selectedPlayer, setSelectedPlayer, selectedCampaign, setSelectedCampaign, campaigns, setCampaigns } = context!;

    const createPlayer = async (player: IPlayer) => {
        try {
            const res = await sendApiRequest.post("/game", player);
            setPlayers((prev) => [...prev, res.data]);
            PixelToast.success("Player created successfully");
        } catch (error) {
            console.log("Error creating player:", error);
            PixelToast.error("Error creating player");
        }
    };

    const createCampaign = async (input: CreateCampaignInput) => {
        try {
            const res = await sendApiRequest.post(`/game/campaign/${selectedPlayer?.id}`, input);
            setCampaigns((prev) => [...prev, res.data]);
            PixelToast.success("Campaign created successfully");
            router.push("/game/campaigns-lobby");
        } catch (error) {
            console.log("Error creating campaign:", error);
            PixelToast.error("Error creating campaign");
        }
    };

    const getAllPlayerCampaigns = useCallback(async () => {
        try {
            const res = await sendApiRequest.get(`/game/campaigns/${selectedPlayer?.id}`);
            setCampaigns(res.data);
            return res.data;
        } catch (error) {
            console.log("Error fetching player campaigns:", error);
        }
    }, [selectedPlayer?.id, setCampaigns]);

    return {
        selectedPlayer,
        setSelectedPlayer,
        players,
        createPlayer,
        createCampaign,
        getAllPlayerCampaigns,
        selectedCampaign,
        setSelectedCampaign,
        campaigns,
        setCampaigns
    };
};

export default useGame;
