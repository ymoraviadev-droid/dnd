import { useContext } from "react";
import gameContext from "../store/game/game.context";
import useAuth from "./useAuth";
import { sendApiRequest } from "../utils/sendApiRequest";
import { IPlayer } from "@dnd/types";
import { ToastAndroid } from "react-native";

const useGame = () => {
    const { players, setPlayers } = useAuth();
    const context = useContext(gameContext);
    const { selectedPlayer, setSelectedPlayer } = context!;

    const createPlayer = async (player: IPlayer) => {
        try {
            const res = await sendApiRequest.post("/game", player);
            setPlayers((prev) => [...prev, res.data]);
            ToastAndroid.show("Player created successfully", ToastAndroid.SHORT);
        } catch (error) {
            console.log("Error creating player:", error);
            ToastAndroid.show("Error creating player", ToastAndroid.SHORT);
        }
    };


    return { selectedPlayer, setSelectedPlayer, players, createPlayer };
};

export default useGame;
