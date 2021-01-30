import { useNotificationsContext } from 'context/notificationsContext';
import { useAppContext } from 'context/appContext';
import { useCallback } from 'react';
import { ERROR_NOTIFICATION_MESSAGE } from 'config/notifications';

interface ResponseInterface extends Record<string, any> {
  success: boolean;
  message: string;
}

interface UseMutationCallbacksInterface {
  withModal?: boolean;
}

const useMutationCallbacks = (props?: UseMutationCallbacksInterface) => {
  const { withModal } = props || {};
  const { showModal, hideModal, showLoading, hideLoading } = useAppContext();
  const { showErrorNotification, showSuccessNotification } = useNotificationsContext();

  const onCompleteCallback = useCallback(
    (data: ResponseInterface) => {
      if (!data.success) {
        if (withModal) {
          hideModal();
        }
        hideLoading();
        showErrorNotification({
          title: data.message ? data.message : ERROR_NOTIFICATION_MESSAGE,
        });
      }

      if (data.success) {
        if (withModal) hideModal();
        hideLoading();
        showSuccessNotification({
          title: data.message,
        });
      }
    },
    [hideLoading, hideModal, showErrorNotification, showSuccessNotification, withModal],
  );

  const onErrorCallback = useCallback(
    (error: any) => {
      let message = ERROR_NOTIFICATION_MESSAGE;
      if (error && error.graphQLErrors) {
        message = error.graphQLErrors.map(({ message }: any) => `${message} `);
      }

      if (withModal) {
        hideModal();
      }
      hideLoading();
      showErrorNotification({ message });
    },
    [hideLoading, hideModal, showErrorNotification, withModal],
  );

  return {
    showModal,
    hideModal,
    showLoading,
    hideLoading,
    showErrorNotification,
    showSuccessNotification,
    onCompleteCallback,
    onErrorCallback,
  };
};

export default useMutationCallbacks;
