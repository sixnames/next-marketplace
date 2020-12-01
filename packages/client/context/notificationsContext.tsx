import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import Notification, { NotificationInterface } from '../components/Notification/Notification';
import { ERROR_NOTIFICATION_MESSAGE, NOTIFICATION_TIMEOUT } from '../config';
import Portal from '@reach/portal';
import classes from './NotificationsProvider.module.css';

type StateNotificationInterface = Omit<NotificationInterface, 'closeHandler'>;

interface NotificationsContextInterface {
  notifications: StateNotificationInterface[];
  setNotifications: React.Dispatch<React.SetStateAction<StateNotificationInterface[]>>;
}

const NotificationsContext = createContext<NotificationsContextInterface>({
  notifications: [],
  setNotifications: () => undefined,
});

const NotificationsProvider: React.FC = ({ children }) => {
  const [notifications, setNotifications] = useState<StateNotificationInterface[]>([]);

  const value = useMemo(() => {
    return {
      setNotifications,
      notifications,
    };
  }, [notifications]);

  const closeNotificationHandler = useCallback((index: number) => {
    setNotifications((prevState) => {
      return prevState.reduce((acc: StateNotificationInterface[], notification, currentIndex) => {
        if (currentIndex === index) {
          return acc;
        }
        return [...acc, notification];
      }, []);
    });
  }, []);

  return (
    <NotificationsContext.Provider value={value}>
      {children}
      <Portal>
        <div className={classes.frame}>
          {notifications.map((notification, index) => {
            return (
              <Notification
                {...notification}
                className={classes.notification}
                key={`${notification.title}-${notification.message}-${index}`}
                closeHandler={() => closeNotificationHandler(index)}
              />
            );
          })}
        </div>
      </Portal>
    </NotificationsContext.Provider>
  );
};

function useNotificationsContext() {
  const context = useContext<NotificationsContextInterface>(NotificationsContext);

  if (!context) {
    throw new Error('useNotificationsContext must be used within a NotificationsProvider');
  }

  const showNotification = useCallback(
    (args: StateNotificationInterface) => {
      context.setNotifications((prevState) => {
        return prevState.concat([args]);
      });
      setTimeout(() => {
        context.setNotifications((prevState) => prevState.slice(1));
      }, NOTIFICATION_TIMEOUT);
    },
    [context],
  );

  const showErrorNotification = useCallback(
    (props?: Omit<StateNotificationInterface, 'variant'>) => {
      const { title = ERROR_NOTIFICATION_MESSAGE, message = 'Попробуйте ещё раз' } = props || {};

      showNotification({
        title,
        message,
        variant: 'error',
        testId: 'error-notification',
      });
    },
    [showNotification],
  );

  const showSuccessNotification = useCallback(
    (props?: Omit<StateNotificationInterface, 'variant'>) => {
      const { title = '', message = '' } = props || {};
      showNotification({
        title,
        message,
        variant: 'success',
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
