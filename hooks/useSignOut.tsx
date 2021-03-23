import { signOut } from 'next-auth/client';
import * as React from 'react';
import { useNotificationsContext } from 'context/notificationsContext';
import { useRouter } from 'next/router';

const useSignOut = () => {
  const router = useRouter();
  const { showErrorNotification } = useNotificationsContext();

  const signOutHandler = React.useCallback(() => {
    signOut({ redirect: false })
      .then(() => {
        router.push('/').catch((e) => {
          console.log(e);
        });
      })
      .catch(() => {
        showErrorNotification();
      });
  }, [router, showErrorNotification]);

  return signOutHandler;
};

export default useSignOut;
