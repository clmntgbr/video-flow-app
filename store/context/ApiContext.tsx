"use client";
import { useAuth } from "@clerk/nextjs";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import ApiClient from "../client/ApiClient";

const ApiContext = createContext<ApiClient | null>(null);

export function ApiProvider({ children }: { children: ReactNode }) {
  const [apiClient, setApiClient] = useState<ApiClient | null>(null);
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    const initializeClient = async () => {
      if (isSignedIn) {
        try {
          const token = await getToken();
          if (token) {
            setApiClient(new ApiClient(token));
          }
        } catch (error) {}
      } else {
        setApiClient(null);
      }
    };

    initializeClient();
    let tokenCheckInterval: NodeJS.Timeout | null = null;

    if (isSignedIn && !apiClient) {
      tokenCheckInterval = setInterval(async () => {
        const token = await getToken();
        if (token) {
          setApiClient(new ApiClient(token));
          if (tokenCheckInterval) clearInterval(tokenCheckInterval);
        }
      }, 1000);
    }

    return () => {
      if (tokenCheckInterval) clearInterval(tokenCheckInterval);
    };
  }, [getToken, isSignedIn]);

  return <ApiContext.Provider value={apiClient}>{children}</ApiContext.Provider>;
}

export function useApiClient() {
  const apiClient = useContext(ApiContext);
  return apiClient;
}
