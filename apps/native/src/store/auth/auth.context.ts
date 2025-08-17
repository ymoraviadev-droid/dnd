import { createContext } from "react";
import { IUser } from "@dnd/types";

const authContext = createContext<{
    user: IUser | null;
    setUser: (user: IUser | null) => void;
} | null>({
    user: null,
    setUser: () => { }
});

export default authContext;
