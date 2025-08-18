import { createContext } from "react";
import { IUser } from "@dnd/types";

const authContext = createContext<{
    user: IUser | null;
    setUser: (user: IUser | null) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
} | null>({
    user: null,
    setUser: () => { },
    loading: false,
    setLoading: () => { }
});

export default authContext;
