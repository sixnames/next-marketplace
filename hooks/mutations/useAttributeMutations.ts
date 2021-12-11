import { REQUEST_METHOD_PATCH } from 'config/common';
import { UpdateAttributeInputInterface } from 'db/dao/attributes/updateAttribute';
import { AttributePayloadModel } from 'db/dbModels';
import { useMutationHandler } from 'hooks/mutations/useFetch';

const basePath = '/api/attributes';

// update
export const useUpdateAttribute = () => {
  return useMutationHandler<AttributePayloadModel, UpdateAttributeInputInterface>({
    path: basePath,
    method: REQUEST_METHOD_PATCH,
  });
};
