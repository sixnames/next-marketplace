import { REQUEST_METHOD_DELETE, REQUEST_METHOD_PATCH, REQUEST_METHOD_POST } from 'config/common';
import { CreateAttributeInputInterface } from 'db/dao/attributes/createAttribute';
import { DeleteAttributeInputInterface } from 'db/dao/attributes/deleteAttribute';
import { UpdateAttributeInputInterface } from 'db/dao/attributes/updateAttribute';
import { AttributePayloadModel } from 'db/dbModels';
import { useMutationHandler } from 'hooks/mutations/useFetch';

const basePath = '/api/attributes';

// create
export const useCreateAttributeMutation = () => {
  return useMutationHandler<AttributePayloadModel, CreateAttributeInputInterface>({
    path: basePath,
    method: REQUEST_METHOD_POST,
  });
};

// update
export const useUpdateAttributeMutation = () => {
  return useMutationHandler<AttributePayloadModel, UpdateAttributeInputInterface>({
    path: basePath,
    method: REQUEST_METHOD_PATCH,
  });
};

// update
export const useDeleteAttributeMutation = () => {
  return useMutationHandler<AttributePayloadModel, DeleteAttributeInputInterface>({
    path: basePath,
    method: REQUEST_METHOD_DELETE,
  });
};
