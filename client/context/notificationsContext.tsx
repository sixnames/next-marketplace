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
      icon = 'Error',
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

  function showErrorNotification({
    key = 'error',
    title = ERROR_NOTIFICATION_MESSAGE,
    message = 'Попробуйте ещё раз',
  }) {
    showNotification({
      key,
      title,
      message,
      type: 'error',
      testId: 'error-notification',
    });
  }

  function showSuccessNotification({ title, message }: SuccessNotificationInterface) {
    showNotification({
      key: 'success',
      title,
      message,
      type: 'success',
      testId: 'success-notification',
    });
  }

  return {
    showNotification,
    showErrorNotification,
    showSuccessNotification,
  };
}

export { NotificationsProvider, useNotificationsContext };
