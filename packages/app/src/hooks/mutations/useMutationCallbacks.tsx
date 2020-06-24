import { useNotificationsContext } from '../../context/notificationsContext';
import { useAppContext } from '../../context/appContext';
import { ERROR_NOTIFICATION_MESSAGE } from '../../config';

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

  function onErrorCallback(error: Error) {
    console.error('onErrorCallback', JSON.stringify(error, null, 2));

    if (withModal) hideModal();
    hideLoading();
    showErrorNotification({});
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
