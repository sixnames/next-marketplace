import { useAppContext } from '../../components/context/appContext';
import { InfoModalInterface } from '../../components/Modal/InfoModal';
import { CheckGiftCertificateAvailabilityInputInterface } from '../../db/dao/giftCertificate/checkGiftCertificateAvailability';
import { CreateGiftCertificateInputInterface } from '../../db/dao/giftCertificate/createGiftCertificate';
import { DeleteGiftCertificateInputInterface } from '../../db/dao/giftCertificate/deleteGiftCertificate';
import { UpdateGiftCertificateInputInterface } from '../../db/dao/giftCertificate/updateGiftCertificate';
import { GiftCertificatePayloadModel } from '../../db/dbModels';
import {
  REQUEST_METHOD_DELETE,
  REQUEST_METHOD_PATCH,
  REQUEST_METHOD_POST,
} from '../../lib/config/common';
import { INFO_MODAL } from '../../lib/config/modalVariants';
import { useMutationHandler } from './useFetch';

const basePath = '/api/gift-certificates';

// create
export const useCreateGiftCertificateMutation = () => {
  return useMutationHandler<GiftCertificatePayloadModel, CreateGiftCertificateInputInterface>({
    path: basePath,
    method: REQUEST_METHOD_POST,
  });
};

// update
export const useUpdateGiftCertificateMutation = () => {
  return useMutationHandler<GiftCertificatePayloadModel, UpdateGiftCertificateInputInterface>({
    path: basePath,
    method: REQUEST_METHOD_PATCH,
  });
};

// delete
export const useDeleteGiftCertificateMutation = () => {
  return useMutationHandler<GiftCertificatePayloadModel, DeleteGiftCertificateInputInterface>({
    path: basePath,
    method: REQUEST_METHOD_DELETE,
  });
};

// check
export const useCheckGiftCertificateMutation = () => {
  const { showModal } = useAppContext();
  const defaultMessage = 'Что-то пошло не так. Попробуйте ещё раз.';
  return useMutationHandler<
    GiftCertificatePayloadModel,
    CheckGiftCertificateAvailabilityInputInterface
  >({
    path: `${basePath}/check`,
    method: REQUEST_METHOD_PATCH,
    reload: false,
    showNotification: false,
    onError: (payload) => {
      if (!payload) {
        showModal<InfoModalInterface>({
          variant: INFO_MODAL,
          props: {
            testId: 'gift-certificate-check-error',
            message: defaultMessage,
          },
        });
        return;
      }
      showModal<InfoModalInterface>({
        variant: INFO_MODAL,
        props: {
          testId: 'gift-certificate-check-message',
          message: payload.message,
        },
      });
    },
    onSuccess: (payload) => {
      if (!payload) {
        showModal<InfoModalInterface>({
          variant: INFO_MODAL,
          props: {
            testId: 'gift-certificate-check-error',
            message: defaultMessage,
          },
        });
        return;
      }
      showModal<InfoModalInterface>({
        variant: INFO_MODAL,
        props: {
          testId: 'gift-certificate-check-message',
          message: payload.message,
        },
      });
    },
  });
};
