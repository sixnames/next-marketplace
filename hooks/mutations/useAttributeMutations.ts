import { CreateAttributeInputInterface } from '../../db/dao/attributes/createAttribute';
import { DeleteAttributeInputInterface } from '../../db/dao/attributes/deleteAttribute';
import { MoveAttributeInputInterface } from '../../db/dao/attributes/moveAttribute';
import { UpdateAttributeInputInterface } from '../../db/dao/attributes/updateAttribute';
import { AttributePayloadModel } from '../../db/dbModels';
import {
  REQUEST_METHOD_DELETE,
  REQUEST_METHOD_PATCH,
  REQUEST_METHOD_POST,
} from '../../lib/config/common';
import { useMutationHandler } from './useFetch';

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

// move
export const useMoveAttributeMutation = () => {
  return useMutationHandler<AttributePayloadModel, MoveAttributeInputInterface>({
    path: `${basePath}/move`,
    method: REQUEST_METHOD_PATCH,
  });
};
