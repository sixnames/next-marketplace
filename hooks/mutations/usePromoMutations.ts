import {
  REQUEST_METHOD_DELETE,
  REQUEST_METHOD_PATCH,
  REQUEST_METHOD_POST,
} from '../../config/common';
import { AddPromoProductsInputInterface } from '../../db/dao/promo/addPromoProducts';
import { CreatePromoInputInterface } from '../../db/dao/promo/createPromo';
import { DeletePromoInputInterface } from '../../db/dao/promo/deletePromo';
import { DeletePromoProductsInputInterface } from '../../db/dao/promo/deletePromoProducts';
import { UpdatePromoInputInterface } from '../../db/dao/promo/updatePromo';
import { PromoPayloadModel } from '../../db/dbModels';
import { useMutationHandler } from './useFetch';

const basePath = '/api/promo';

// promo
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

// promo products
// add
export const useAddPromoProducts = () => {
  return useMutationHandler<PromoPayloadModel, AddPromoProductsInputInterface>({
    path: `${basePath}/products`,
    method: REQUEST_METHOD_POST,
  });
};

// delete
export const useDeletePromoProducts = () => {
  return useMutationHandler<PromoPayloadModel, DeletePromoProductsInputInterface>({
    path: `${basePath}/products`,
    method: REQUEST_METHOD_DELETE,
  });
};
