import { useContext } from "react";
import { ConfigurationContext, ConfigurationContextType } from "./context";

export default function useConfigurationContext(): ConfigurationContextType {
  const mediaPodContext = useContext(ConfigurationContext);

  if (mediaPodContext === undefined) {
    // @ts-expect-error: Log error instead of throw
    return;
  }

  return mediaPodContext;
}
