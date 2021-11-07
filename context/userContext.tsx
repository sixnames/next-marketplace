import { REQUEST_METHOD_GET } from 'config/common';
import { UserInterface } from 'db/uiInterfaces';
import * as React from 'react';
import { useSession } from 'next-auth/client';

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
  const [session] = useSession();
  const [user, setUser] = React.useState<UserInterface | null | undefined>(() => sessionUser);

  React.useEffect(() => {
    if (session && !user) {
      fetch('/api/user/session', {
        method: REQUEST_METHOD_GET,
      })
        .then((res) => res.json())
        .then((sessionUser) => {
          if (sessionUser) {
            setUser(sessionUser);
          }
        });
    }
  }, [user, session]);

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
