import React from 'react';
import { UserProvider } from './UserContext';
import { SessionProvider } from './SessionContext';
import { TopicProvider } from './TopicContext';
import { FriendsProvider } from './FriendsContext';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <UserProvider>
      <SessionProvider>
        <TopicProvider>
          <FriendsProvider>
            {children}
          </FriendsProvider>
        </TopicProvider>
      </SessionProvider>
    </UserProvider>
  );
};