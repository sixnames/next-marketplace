import * as React from 'react';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { getConstantTranslation } from '../lib/config/constantTranslations';
import { useAppContext } from '../components/context/appContext';
import { useNotificationsContext } from '../components/context/notificationsContext';

interface ResponseInterface extends Record<string, any> {
  success: boolean;
  message: string;
}

interface UseMutationCallbacksInterface {
  withModal?: boolean;
  reload?: boolean;
}

const useMutationCallbacks = (props?: UseMutationCallbacksInterface) => {
  const router = useRouter();
  const { locale } = router;
  const { withModal, reload } = props || {};
  const { showModal, hideModal, showLoading, hideLoading } = useAppContext();
  const { showErrorNotification, showSuccessNotification } = useNotificationsContext();
  const defaultErrorMessage = React.useMemo(() => {
    return getConstantTranslation(`messages.error.${locale}`);
  }, [locale]);

  const onCompleteCallback = useCallback(
    (data: ResponseInterface) => {
      if (!data.success) {
        if (withModal) {
          hideModal();
        }
        hideLoading();
        showErrorNotification({
          title: data.message ? data.message : defaultErrorMessage,
        });
        return;
      }

      if (data.success) {
        if (reload) {
          router.reload();
          return;
        }

        if (withModal) {
          hideModal();
        }

        hideLoading();
        showSuccessNotification({
          title: data.message,
        });
      }
    },
    [
      defaultErrorMessage,
      hideLoading,
      hideModal,
      reload,
      router,
      showErrorNotification,
      showSuccessNotification,
      withModal,
    ],
  );

  const onErrorCallback = useCallback(
    (error: any) => {
      let message = defaultErrorMessage;
      if (error && error.graphQLErrors) {
        message = error.graphQLErrors.map(({ message }: any) => `${message} `);
      }

      if (withModal) {
        hideModal();
      }
      hideLoading();
      showErrorNotification({ message });
    },
    [defaultErrorMessage, hideLoading, hideModal, showErrorNotification, withModal],
  );

  return {
    router,
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
