import { useRouter } from 'next/router';
import * as React from 'react';

const LISTENER_TYPE = 'storage';
const RELOAD_STATE_NAME = 'reload';
const RELOAD_STATE_TRUE = 'true';
const RELOAD_STATE_FALSE = 'false';

export const useReloadListener = () => {
  const router = useRouter();
  React.useEffect(() => {
    function storageListener() {
      const isReload = window.localStorage.getItem(RELOAD_STATE_NAME);
      if (isReload === RELOAD_STATE_TRUE) {
        window.localStorage.setItem(RELOAD_STATE_NAME, RELOAD_STATE_FALSE);
        router.reload();
      }
    }
    window.addEventListener(LISTENER_TYPE, storageListener);
    return () => {
      window.removeEventListener(LISTENER_TYPE, storageListener);
    };
  }, [router]);

  const setReloadToTrue = React.useCallback(() => {
    window.localStorage.setItem('reload', 'true');
  }, []);

  return {
    setReloadToTrue,
  };
};
