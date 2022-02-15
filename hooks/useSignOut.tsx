import { signOut } from 'next-auth/react';
import * as React from 'react';
import { useNotificationsContext } from '../components/context/notificationsContext';

const useSignOut = () => {
  const { showErrorNotification } = useNotificationsContext();

  const signOutHandler = React.useCallback(() => {
    signOut({ redirect: false })
      .then(() => {
        window.location.pathname = '/';
      })
      .catch(() => {
        showErrorNotification();
      });
  }, [showErrorNotification]);

  return signOutHandler;
};

export default useSignOut;
