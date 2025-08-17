import { IUser } from "@dnd/types";
import { ReactNode, useState } from "react";
import authContext from "./auth.context";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);

  return (
    <authContext.Provider value={{ user, setUser }}>{children}</authContext.Provider>
  );
};

export default AuthProvider;
