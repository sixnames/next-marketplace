// update
import { REQUEST_METHOD_PATCH } from 'config/common';
import { UpdateSeoContentInputInterface } from 'db/dao/seo-content/updateSeoContent';
import { ProductPayloadModel } from 'db/dbModels';
import { useMutationHandler } from 'hooks/mutations/useFetch';

export const useUpdateSeoContent = () => {
  return useMutationHandler<ProductPayloadModel, UpdateSeoContentInputInterface>({
    path: '/api/seo-content',
    method: REQUEST_METHOD_PATCH,
  });
};
