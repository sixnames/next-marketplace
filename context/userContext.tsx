import { UserInterface } from 'db/uiInterfaces';
import * as React from 'react';
// import { useSession } from 'next-auth/client';

interface UserContextInterface {
  sessionUser?: UserInterface | null;
}

const UserContext = React.createContext<UserContextInterface>({
  sessionUser: null,
});

interface UserContextProviderInterface {
  sessionUser?: UserInterface | null;
}

const UserContextProvider: React.FC<UserContextProviderInterface> = ({ children, sessionUser }) => {
  const value = React.useMemo(() => {
    return {
      sessionUser: sessionUser,
    };
  }, [sessionUser]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

function useUserContext() {
  const context: UserContextInterface = React.useContext(UserContext);

  if (!context) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }

  return context;
}

export { UserContextProvider, useUserContext };
