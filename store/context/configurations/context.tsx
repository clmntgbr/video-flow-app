"use client";

import React, { createContext, Dispatch, PropsWithChildren, useEffect, useReducer } from "react";
import { useApiClient } from "../ApiContext";
import { getConfiguration } from "../dispatch/configurations/getConfiguration";
import { configurationReducer, ConfigurationState, initialConfigurationState } from "./reducer";
import { ConfigurationActionTypes } from "./types";

export type ConfigurationContextType = {
  configuration: ConfigurationState;
  configurationDispatch: Dispatch<ConfigurationActionTypes>;
};

export const ConfigurationContext = createContext<ConfigurationContextType | undefined>(undefined);

export const ConfigurationProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [configuration, configurationDispatch] = useReducer(configurationReducer, initialConfigurationState);
  const apiClient = useApiClient();

  useEffect(() => {
    if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
      (window as { configurationDispatch?: Dispatch<ConfigurationActionTypes> }).configurationDispatch = configurationDispatch;
    }
  }, [configurationDispatch]);

  useEffect(() => {
    const fetchConfiguration = async () => {
      if (apiClient) {
        getConfiguration(configurationDispatch, apiClient);
      }
    };

    fetchConfiguration();
  }, [apiClient]);

  return <ConfigurationContext.Provider value={{ configuration, configurationDispatch }}>{children}</ConfigurationContext.Provider>;
};
