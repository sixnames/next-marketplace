import { useRouter } from 'next/router';
import { CreateTaskInputInterface } from '../../db/dao/tasks/createTask';
import { CreateTaskVariantInputInterface } from '../../db/dao/tasks/createTaskVariant';
import { DeleteTaskInputInterface } from '../../db/dao/tasks/deleteTask';
import { DeleteTaskVariantInputInterface } from '../../db/dao/tasks/deleteTaskVariant';
import { UpdateTaskInputInterface } from '../../db/dao/tasks/updateTask';
import { UpdateTaskVariantInputInterface } from '../../db/dao/tasks/updateTaskVariant';
import { TaskPayloadModel, TaskVariantPayloadModel } from '../../db/dbModels';
import {
  REQUEST_METHOD_DELETE,
  REQUEST_METHOD_PATCH,
  REQUEST_METHOD_POST,
} from '../../lib/config/common';
import { getConsoleTaskLinks, getConsoleTaskVariantLinks } from '../../lib/linkUtils';
import { useMutationHandler } from './useFetch';

const taskBasePath = '/api/tasks';
const variantsBasePath = `${taskBasePath}/variants`;

// tasks
// create
export const useCreateTask = (basePath: string) => {
  const router = useRouter();
  return useMutationHandler<TaskPayloadModel, CreateTaskInputInterface>({
    path: taskBasePath,
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
    path: taskBasePath,
    method: REQUEST_METHOD_PATCH,
  });
};

// create
export const useDeleteTask = () => {
  return useMutationHandler<TaskPayloadModel, DeleteTaskInputInterface>({
    path: taskBasePath,
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
