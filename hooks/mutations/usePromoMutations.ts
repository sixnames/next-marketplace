import { REQUEST_METHOD_DELETE, REQUEST_METHOD_PATCH, REQUEST_METHOD_POST } from 'config/common';
import { CreatePromoInputInterface } from 'db/dao/promo/createPromo';
import { DeletePromoInputInterface } from 'db/dao/promo/deletePromo';
import { UpdatePromoInputInterface } from 'db/dao/promo/updatePromo';
import { PromoPayloadModel } from 'db/dbModels';
import { useMutationHandler } from 'hooks/mutations/useFetch';

const basePath = '/api/promo';

// page
// create
export const useCreatePromo = () => {
  return useMutationHandler<PromoPayloadModel, CreatePromoInputInterface>({
    path: basePath,
    method: REQUEST_METHOD_POST,
  });
};

// update
export const useUpdatePromo = () => {
  return useMutationHandler<PromoPayloadModel, UpdatePromoInputInterface>({
    path: basePath,
    method: REQUEST_METHOD_PATCH,
  });
};

// delete
export const useDeletePromo = () => {
  return useMutationHandler<PromoPayloadModel, DeletePromoInputInterface>({
    path: basePath,
    method: REQUEST_METHOD_DELETE,
  });
};
