import { useEffect } from "react";
import { router } from "expo-router";
import useAuth from "../src/hooks/useAuth";

const IndexScreen = () => {
  const { user, loading } = useAuth();

  console.log("Hello World from IndexScreen");
  

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else {
        router.push("/home");
      }
    }
  }, [user, loading]);

  if (loading) {
    return null;
  }

  return null;
};

export default IndexScreen;
