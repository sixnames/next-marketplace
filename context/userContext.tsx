import { UserInterface } from 'db/uiInterfaces';
import * as React from 'react';

interface UserContextInterface {
  me?: UserInterface | null;
  setUser: (user: UserInterface) => void;
}

const UserContext = React.createContext<UserContextInterface>({
  me: null,
  setUser: () => undefined,
});

interface UserContextProviderInterface {
  sessionUser?: UserInterface | null;
}

const UserContextProvider: React.FC<UserContextProviderInterface> = ({ children, sessionUser }) => {
  const [user, setUser] = React.useState<UserInterface | null | undefined>(() => sessionUser);
  const value = React.useMemo(() => {
    return {
      me: user,
      setUser,
    };
  }, [user]);

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
