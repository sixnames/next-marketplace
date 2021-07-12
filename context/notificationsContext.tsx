import { NOTIFICATION_TIMEOUT } from 'config/common';
import { getConstantTranslation } from 'config/constantTranslations';
import { useRouter } from 'next/router';
import * as React from 'react';
import Portal from '@reach/portal';
import Notification, { NotificationInterface } from 'components/Notification';

interface StateNotificationInterface extends Omit<NotificationInterface, 'closeHandler'> {
  createdAt: number;
}

type ShowNotificationInterface = Omit<StateNotificationInterface, 'createdAt'>;

type ApiNotificationInterface = Omit<
  ShowNotificationInterface,
  'testId' | 'variant' | 'closeHandler'
>;

interface NotificationsContextInterface {
  notifications: StateNotificationInterface[];
  setNotifications: React.Dispatch<React.SetStateAction<StateNotificationInterface[]>>;
}

const notificationStyles = {
  position: 'fixed',
  bottom: '2rem',
  right: '2rem',
  zIndex: 9999,
} as React.CSSProperties;

const NotificationsContext = React.createContext<NotificationsContextInterface>({
  notifications: [],
  setNotifications: () => undefined,
});

const NotificationsProvider: React.FC = ({ children }) => {
  const [notifications, setNotifications] = React.useState<StateNotificationInterface[]>([]);

  const value = React.useMemo(() => {
    return {
      setNotifications,
      notifications,
    };
  }, [notifications]);

  const closeNotificationHandler = React.useCallback((index: number) => {
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
        <div style={notificationStyles}>
          {notifications.map((notification, index) => {
            return (
              <Notification
                {...notification}
                className='mb-4'
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
  const { locale } = useRouter();
  const context = React.useContext<NotificationsContextInterface>(NotificationsContext);

  const defaultErrorMessage = React.useMemo(() => {
    return getConstantTranslation(`messages.error.${locale}`);
  }, [locale]);

  if (!context) {
    throw new Error('useNotificationsContext must be used within a NotificationsProvider');
  }

  const showNotification = React.useCallback(
    (args: ShowNotificationInterface) => {
      context.setNotifications((prevState) => {
        return prevState.concat([
          {
            ...args,
            createdAt: new Date().getTime() + NOTIFICATION_TIMEOUT,
          },
        ]);
      });

      setTimeout(() => {
        context.setNotifications((prevState) => {
          return prevState.reduce((acc: StateNotificationInterface[], notification) => {
            if (new Date().getTime() > notification.createdAt) {
              return acc;
            }
            return [...acc, notification];
          }, []);
        });
      }, NOTIFICATION_TIMEOUT);
    },
    [context],
  );

  const showErrorNotification = React.useCallback(
    (props?: ApiNotificationInterface) => {
      const { title = defaultErrorMessage } = props || {};

      showNotification({
        title,
        message: '',
        variant: 'error',
        testId: 'error-notification',
      });
    },
    [defaultErrorMessage, showNotification],
  );

  const showSuccessNotification = React.useCallback(
    (props?: ApiNotificationInterface) => {
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
