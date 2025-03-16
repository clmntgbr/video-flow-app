import React, { PropsWithChildren } from "react";
import { ConfigurationProvider } from "./configurations";
import { MediaPodProvider } from "./media-pods";
import { UserProvider } from "./users";

const AppContextProviders: React.FC<PropsWithChildren> = ({ children }) => (
  <UserProvider>
    <MediaPodProvider>
      <ConfigurationProvider>
        <AppHooksProvider>{children}</AppHooksProvider>
      </ConfigurationProvider>
    </MediaPodProvider>
  </UserProvider>
);

export { AppContextProviders };

const AppHooksProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return <>{children}</>;
};
