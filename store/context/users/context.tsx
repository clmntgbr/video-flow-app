"use client";

import React, { createContext, Dispatch, PropsWithChildren, useEffect, useReducer } from "react";
import { useApiClient } from "../ApiContext";
import { getUser } from "../dispatch/users/getUser";
import { initialUserState, userReducer, UserState } from "./reducer";
import { UserActionTypes } from "./types";

export type UserContextType = {
  user: UserState;
  userDispatch: Dispatch<UserActionTypes>;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [user, userDispatch] = useReducer(userReducer, initialUserState);
  const apiClient = useApiClient();

  useEffect(() => {
    if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
      (window as { userDispatch?: Dispatch<UserActionTypes> }).userDispatch = userDispatch;
    }
  }, [userDispatch]);

  useEffect(() => {
    const fetchUser = async () => {
      if (apiClient) {
        getUser(userDispatch, apiClient);
      }
    };

    fetchUser();

    const intervalId = setInterval(() => {
      fetchUser();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [apiClient]);

  return <UserContext.Provider value={{ user, userDispatch }}>{children}</UserContext.Provider>;
};
