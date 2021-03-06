import { AddPromoProductsInputInterface } from 'db/dao/promo/addPromoProducts';
import {
  CheckPromoCodeAvailabilityInputInterface,
  CheckPromoCodeAvailabilityPayloadModel,
} from 'db/dao/promo/checkPromoCodeAvailability';
import { CreatePromoInputInterface } from 'db/dao/promo/createPromo';
import { CreatePromoCodeInputInterface } from 'db/dao/promo/createPromoCode';
import { DeletePromoInputInterface } from 'db/dao/promo/deletePromo';
import { DeletePromoCodeInputInterface } from 'db/dao/promo/deletePromoCode';
import { DeletePromoProductsInputInterface } from 'db/dao/promo/deletePromoProducts';
import { UpdatePromoInputInterface } from 'db/dao/promo/updatePromo';
import { UpdatePromoCodeInputInterface } from 'db/dao/promo/updatePromoCode';
import { PromoCodePayloadModel, PromoPayloadModel } from 'db/dbModels';
import { useBasePath } from 'hooks/useBasePath';
import {
  REQUEST_METHOD_DELETE,
  REQUEST_METHOD_PATCH,
  REQUEST_METHOD_POST,
} from 'lib/config/common';
import { useRouter } from 'next/router';
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

// promo code
// create
export const useCreatePromoCode = () => {
  const router = useRouter();
  const redirectBasePath = useBasePath('code');
  return useMutationHandler<PromoCodePayloadModel, CreatePromoCodeInputInterface>({
    path: `${basePath}/codes`,
    method: REQUEST_METHOD_POST,
    reload: false,
    onSuccess: (payload) => {
      if (payload.success && payload.payload) {
        router.push(`${redirectBasePath}/${payload.payload._id}`).catch(console.log);
      }
    },
  });
};

// update
export const useUpdatePromoCode = () => {
  return useMutationHandler<PromoCodePayloadModel, UpdatePromoCodeInputInterface>({
    path: `${basePath}/codes`,
    method: REQUEST_METHOD_PATCH,
  });
};

// delete
export const useDeletePromoCode = () => {
  return useMutationHandler<PromoCodePayloadModel, DeletePromoCodeInputInterface>({
    path: `${basePath}/codes`,
    method: REQUEST_METHOD_DELETE,
  });
};

// check
export const useCheckPromoCode = () => {
  return useMutationHandler<
    CheckPromoCodeAvailabilityPayloadModel,
    CheckPromoCodeAvailabilityInputInterface
  >({
    path: `${basePath}/codes/check`,
    method: REQUEST_METHOD_POST,
  });
};
