import { REQUEST_METHOD_PATCH } from '../../lib/config/common';
import { UpdateSeoContentInputInterface } from '../../db/dao/seo-content/updateSeoContent';
import { ProductPayloadModel } from '../../db/dbModels';
import { useMutationHandler } from './useFetch';

// update
export const useUpdateSeoContent = () => {
  return useMutationHandler<ProductPayloadModel, UpdateSeoContentInputInterface>({
    path: '/api/seo-content',
    method: REQUEST_METHOD_PATCH,
  });
};
