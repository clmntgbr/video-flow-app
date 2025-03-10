"use client";

import { useClerk } from "@clerk/nextjs";
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
  const { signOut } = useClerk();

  useEffect(() => {
    if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
      (window as { userDispatch?: Dispatch<UserActionTypes> }).userDispatch = userDispatch;
    }
  }, [userDispatch]);

  useEffect(() => {
    let intervalId: string | number | NodeJS.Timeout | undefined;
    let attempts = 0;

    const fetchUser = async () => {
      if (apiClient) {
        const response = await getUser(userDispatch, apiClient);
        if (response === null) {
          attempts++;
          if (attempts === 10) {
            signOut({ redirectUrl: "/sign-in" });
          }

          clearInterval(intervalId);
          intervalId = setInterval(fetchUser, 2000);
        } else {
          attempts = 0;
          clearInterval(intervalId);
          intervalId = setInterval(fetchUser, 30000);
        }
      }
    };

    fetchUser();
    intervalId = setInterval(fetchUser, 30000);

    return () => clearInterval(intervalId);
  }, [apiClient]);

  return <UserContext.Provider value={{ user, userDispatch }}>{children}</UserContext.Provider>;
};
