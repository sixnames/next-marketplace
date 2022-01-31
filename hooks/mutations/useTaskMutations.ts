import { useRouter } from 'next/router';
import {
  REQUEST_METHOD_DELETE,
  REQUEST_METHOD_PATCH,
  REQUEST_METHOD_POST,
} from '../../config/common';
import { CreateTaskInputInterface } from '../../db/dao/tasks/createTask';
import { DeleteTaskInputInterface } from '../../db/dao/tasks/deleteTask';
import { DeleteTaskVariantInputInterface } from '../../db/dao/tasks/deleteTaskVariant';
import { UpdateTaskInputInterface } from '../../db/dao/tasks/updateTask';
import { UpdateTaskVariantInputInterface } from '../../db/dao/tasks/updateTaskVariant';
import { CreateTaskVariantInputInterface } from '../../db/dao/tasks/createTaskVariant';
import { TaskPayloadModel, TaskVariantPayloadModel } from '../../db/dbModels';
import { getConsoleTaskLinks, getConsoleTaskVariantLinks } from '../../lib/linkUtils';
import { useMutationHandler } from './useFetch';

const basePath = '/api/tasks';
const variantsBasePath = `${basePath}/variants`;

// tasks
// create
export const useCreateTask = (basePath: string) => {
  const router = useRouter();
  return useMutationHandler<TaskPayloadModel, CreateTaskInputInterface>({
    path: basePath,
    method: REQUEST_METHOD_POST,
    reload: false,
    onSuccess: (payload) => {
      if (payload.success) {
        const links = getConsoleTaskLinks({
          basePath,
        });
        router.push(links.parentLink).catch(console.log);
      }
    },
  });
};

// create
export const useUpdateTask = () => {
  return useMutationHandler<TaskPayloadModel, UpdateTaskInputInterface>({
    path: basePath,
    method: REQUEST_METHOD_PATCH,
  });
};

// create
export const useDeleteTask = () => {
  return useMutationHandler<TaskPayloadModel, DeleteTaskInputInterface>({
    path: basePath,
    method: REQUEST_METHOD_DELETE,
  });
};

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
