"use client";

import React, { createContext, Dispatch, PropsWithChildren, useEffect, useReducer } from "react";
import { useApiClient } from "../ApiContext";
import { getMediaPods } from "../dispatch/media-pods/getMediaPods";
import { getRecentsMediaPods } from "../dispatch/media-pods/getRecentsMediaPods";
import { initialMediaPodState, mediaPodReducer, MediaPodState } from "./reducer";
import { MediaPodActionTypes } from "./types";

export type MediaPodContextType = {
  mediaPod: MediaPodState;
  mediaPodDispatch: Dispatch<MediaPodActionTypes>;
};

export const MediaPodContext = createContext<MediaPodContextType | undefined>(undefined);

export const MediaPodProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [mediaPod, mediaPodDispatch] = useReducer(mediaPodReducer, initialMediaPodState);
  const apiClient = useApiClient();

  useEffect(() => {
    if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
      (window as { mediaPodDispatch?: Dispatch<MediaPodActionTypes> }).mediaPodDispatch = mediaPodDispatch;
    }
  }, [mediaPodDispatch]);

  useEffect(() => {
    let intervalId: string | number | NodeJS.Timeout | undefined;

    const fetchMediaPod = async () => {
      if (apiClient) {
        getMediaPods(mediaPodDispatch, apiClient);
        getRecentsMediaPods(mediaPodDispatch, apiClient);
      }
    };

    fetchMediaPod();
    intervalId = setInterval(fetchMediaPod, 10000);

    return () => clearInterval(intervalId);
  }, [apiClient]);

  return <MediaPodContext.Provider value={{ mediaPod, mediaPodDispatch }}>{children}</MediaPodContext.Provider>;
};
