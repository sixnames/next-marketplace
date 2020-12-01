import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { SnackbarProvider, useSnackbar } from 'notistack';
import Notification from '../components/Notification/Notification';
import { ERROR_NOTIFICATION_MESSAGE, NOTIFICATION_TIMEOUT } from '../config';

const NotificationsContext = createContext({});

const NotificationsContent: React.FC = ({ children }) => {
  const [state, setState] = useState({});

  const value = useMemo(() => {
    return {
      setState,
      state: {
        ...state,
      },
    };
  }, [state]);

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
};

const NotificationsProvider: React.FC = ({ children }) => {
  return (
    <SnackbarProvider
      maxSnack={8}
      preventDuplicate
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
    >
      <NotificationsContent>{children}</NotificationsContent>
    </SnackbarProvider>
  );
};

interface SuccessNotificationInterface {
  key?: string;
  title?: string;
  message?: string;
}

interface ErrorNotificationInterface {
  key?: string;
  title?: string;
  message?: string;
}

function useNotificationsContext() {
  const context = useContext(NotificationsContext);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  if (!context) {
    throw new Error('useNotificationsContext must be used within a NotificationsProvider');
  }

  const showNotification = useCallback(
    ({
      key = '',
      title = '',
      message = '',
      path,
      icon = 'exclamation',
      type,
      autoHideDuration = NOTIFICATION_TIMEOUT,
      playSound = false,
      persist = false,
      testId = '',
    }) => {
      enqueueSnackbar(message, {
        key,
        persist,
        autoHideDuration: autoHideDuration,
        content: (
          <div>
            <Notification
              title={title}
              message={message}
              path={path}
              type={type}
              icon={icon}
              testId={testId}
              playSound={playSound}
              closeHandler={() => closeSnackbar(key)}
            />
          </div>
        ),
      });
    },
    [closeSnackbar, enqueueSnackbar],
  );

  const showErrorNotification = useCallback(
    (props?: ErrorNotificationInterface) => {
      const { key = 'error', title = ERROR_NOTIFICATION_MESSAGE, message = 'Попробуйте ещё раз' } =
        props || {};

      showNotification({
        key,
        title,
        message,
        type: 'error',
        testId: 'error-notification',
      });
    },
    [showNotification],
  );

  const showSuccessNotification = useCallback(
    (props?: SuccessNotificationInterface) => {
      const { title = 'Success', message = '' } = props || {};
      showNotification({
        key: 'success',
        title,
        message,
        type: 'success',
        testId: 'success-notification',
      });
    },
    [showNotification],
  );

  return {
    showNotification,
    showErrorNotification,
    showSuccessNotification,
  };
}

export { NotificationsProvider, useNotificationsContext };
