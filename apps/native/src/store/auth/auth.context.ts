import { createContext, Dispatch, SetStateAction } from "react";
import { IPlayer, IUser } from "@dnd/types";

const authContext = createContext<{
    user: IUser | null;
    setUser: (user: IUser | null) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    players: IPlayer[];
    setPlayers: Dispatch<SetStateAction<IPlayer[]>>;
} | null>({
    user: null,
    setUser: () => { },
    loading: false,
    setLoading: () => { },
    players: [],
    setPlayers: () => { }
});

export default authContext;
