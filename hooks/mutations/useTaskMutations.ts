import { useRouter } from 'next/router';
import {
  REQUEST_METHOD_DELETE,
  REQUEST_METHOD_PATCH,
  REQUEST_METHOD_POST,
} from '../../config/common';
import { DeleteTaskVariantInputInterface } from '../../db/dao/tasks/deleteTaskVariant';
import { UpdateTaskVariantInputInterface } from '../../db/dao/tasks/updateTaskVariant';
import { CreateTaskVariantInputInterface } from '../../db/dao/tasks/createTaskVariant';
import { TaskVariantPayloadModel } from '../../db/dbModels';
import { getConsoleTaskVariantLinks } from '../../lib/linkUtils';
import { useMutationHandler } from './useFetch';

const basePath = '/api/tasks';
const variantsBasePath = `${basePath}/variants`;

// variants
// create
export const useCreateTaskVariant = (basePath: string) => {
  const router = useRouter();
  return useMutationHandler<TaskVariantPayloadModel, CreateTaskVariantInputInterface>({
    path: variantsBasePath,
    method: REQUEST_METHOD_POST,
    reload: false,
    onSuccess: (payload) => {
      if (payload.success) {
        const links = getConsoleTaskVariantLinks({
          basePath,
        });
        router.push(links.parentLink).catch(console.log);
      }
    },
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
