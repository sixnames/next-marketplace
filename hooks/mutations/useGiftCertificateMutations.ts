import { REQUEST_METHOD_DELETE, REQUEST_METHOD_PATCH, REQUEST_METHOD_POST } from 'config/common';
import { CheckGiftCertificateAvailabilityInputInterface } from 'db/dao/giftCertificate/checkGiftCertificateAvailability';
import { CreateGiftCertificateInputInterface } from 'db/dao/giftCertificate/createGiftCertificate';
import { DeleteGiftCertificateInputInterface } from 'db/dao/giftCertificate/deleteGiftCertificate';
import { UpdateGiftCertificateInputInterface } from 'db/dao/giftCertificate/updateGiftCertificate';
import { GiftCertificatePayloadModel } from 'db/dbModels';
import { useMutationHandler } from 'hooks/mutations/useFetch';

const basePath = '/api/gift-certificates';

// create
export const useCreateGiftCertificate = () => {
  return useMutationHandler<GiftCertificatePayloadModel, CreateGiftCertificateInputInterface>({
    path: basePath,
    method: REQUEST_METHOD_POST,
  });
};

// update
export const useUpdateGiftCertificate = () => {
  return useMutationHandler<GiftCertificatePayloadModel, UpdateGiftCertificateInputInterface>({
    path: basePath,
    method: REQUEST_METHOD_PATCH,
  });
};

// delete
export const useDeleteGiftCertificate = () => {
  return useMutationHandler<GiftCertificatePayloadModel, DeleteGiftCertificateInputInterface>({
    path: basePath,
    method: REQUEST_METHOD_DELETE,
  });
};

// check
export const useCheckGiftCertificate = () => {
  return useMutationHandler<
    GiftCertificatePayloadModel,
    CheckGiftCertificateAvailabilityInputInterface
  >({
    path: `${basePath}/check`,
    method: REQUEST_METHOD_PATCH,
    reload: false,
  });
};
