import { signOut } from 'next-auth/client';
import * as React from 'react';
import { useNotificationsContext } from '../context/notificationsContext';

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
