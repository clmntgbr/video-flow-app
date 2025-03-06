import { useContext } from "react";
import { UserContext, UserContextType } from "./context";

export default function useUserContext(): UserContextType {
  const userContext = useContext(UserContext);

  if (userContext === undefined) {
    // @ts-expect-error: Log error instead of throw
    return;
  }

  return userContext;
}
