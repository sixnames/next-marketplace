import {
  REQUEST_METHOD_DELETE,
  REQUEST_METHOD_PATCH,
  REQUEST_METHOD_POST,
} from '../../config/common';
import { DeleteTaskVariantInputInterface } from '../../db/dao/shopProduct/deleteTaskVariant';
import { UpdateTaskVariantInputInterface } from '../../db/dao/shopProduct/updateTaskVariant';
import { CreateTaskVariantInputInterface } from '../../db/dao/tasks/createTaskVariant';
import { TaskVariantPayloadModel } from '../../db/dbModels';
import { useMutationHandler } from './useFetch';

const basePath = '/api/tasks';
const variantsBasePath = `${basePath}/variants`;

// variants
// create
export const useCreateTaskVariant = () => {
  return useMutationHandler<TaskVariantPayloadModel, CreateTaskVariantInputInterface>({
    path: variantsBasePath,
    method: REQUEST_METHOD_POST,
  });
};
// create
export const useUpdateTaskVariant = () => {
  return useMutationHandler<TaskVariantPayloadModel, UpdateTaskVariantInputInterface>({
    path: variantsBasePath,
    method: REQUEST_METHOD_PATCH,
  });
};
// create
export const useDeleteTaskVariant = () => {
  return useMutationHandler<TaskVariantPayloadModel, DeleteTaskVariantInputInterface>({
    path: variantsBasePath,
    method: REQUEST_METHOD_DELETE,
  });
};
