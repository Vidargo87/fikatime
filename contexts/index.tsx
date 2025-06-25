import React from 'react';
import { UserProvider } from './UserContext';
import { SessionProvider } from './SessionContext';
import { TopicProvider } from './TopicContext';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <UserProvider>
      <SessionProvider>
        <TopicProvider>
          {children}
        </TopicProvider>
      </SessionProvider>
    </UserProvider>
  );
};