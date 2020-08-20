import { useNotificationsContext } from '../context/notificationsContext';
import { ERROR_NOTIFICATION_MESSAGE } from '../config';
import { useAppContext } from '../context/appContext';

interface ResponseInterface {
  success: boolean;
  message: string;
}

const useMutationCallbacks = ({ withModal = false }) => {
  const { showModal, hideModal, showLoading, hideLoading } = useAppContext();
  const { showErrorNotification, showSuccessNotification } = useNotificationsContext();

  function onCompleteCallback(data: ResponseInterface) {
    if (!data.success) {
      if (withModal) hideModal();
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
  }

  function onErrorCallback(error: any) {
    let message = ERROR_NOTIFICATION_MESSAGE;
    if (error && error.graphQLErrors) {
      message = error.graphQLErrors.map(({ message }: any) => `${message} `);
    }

    if (withModal) hideModal();
    hideLoading();
    showErrorNotification({ message });
  }

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
