import React, { PropsWithChildren } from "react";
import { MediaPodProvider } from "./media-pods";
import { UserProvider } from "./users";

const AppContextProviders: React.FC<PropsWithChildren> = ({ children }) => (
  <UserProvider>
    <MediaPodProvider>
      <AppHooksProvider>{children}</AppHooksProvider>
    </MediaPodProvider>
  </UserProvider>
);

export { AppContextProviders };

const AppHooksProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return <>{children}</>;
};
