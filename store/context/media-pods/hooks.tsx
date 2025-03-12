import { useContext } from "react";
import { MediaPodContext, MediaPodContextType } from "./context";

export default function useMediaPodContext(): MediaPodContextType {
  const mediaPodContext = useContext(MediaPodContext);

  if (mediaPodContext === undefined) {
    // @ts-expect-error: Log error instead of throw
    return;
  }

  return mediaPodContext;
}
