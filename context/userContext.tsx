import { UserModel } from 'db/dbModels';
import * as React from 'react';

interface UserContextInterface {
  me?: UserModel | null;
  setUser: (user: UserModel) => void;
}

const UserContext = React.createContext<UserContextInterface>({
  me: null,
  setUser: () => undefined,
});

interface UserContextProviderInterface {
  sessionUser?: UserModel | null;
}

const UserContextProvider: React.FC<UserContextProviderInterface> = ({ children, sessionUser }) => {
  const [user, setUser] = React.useState<UserModel | null | undefined>(() => sessionUser);
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
