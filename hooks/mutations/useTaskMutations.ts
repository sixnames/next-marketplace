import { CreateTaskInputInterface } from 'db/dao/tasks/createTask';
import { CreateTaskVariantInputInterface } from 'db/dao/tasks/createTaskVariant';
import { DeleteTaskInputInterface } from 'db/dao/tasks/deleteTask';
import { DeleteTaskVariantInputInterface } from 'db/dao/tasks/deleteTaskVariant';
import { UpdateTaskInputInterface } from 'db/dao/tasks/updateTask';
import { UpdateTaskVariantInputInterface } from 'db/dao/tasks/updateTaskVariant';
import { TaskPayloadModel, TaskVariantPayloadModel } from 'db/dbModels';
import { useBasePath } from 'hooks/useBasePath';
import {
  REQUEST_METHOD_DELETE,
  REQUEST_METHOD_PATCH,
  REQUEST_METHOD_POST,
} from 'lib/config/common';
import { useRouter } from 'next/router';
import { useMutationHandler } from './useFetch';

const taskBasePath = '/api/tasks';
const variantsBasePath = `${taskBasePath}/variants`;

// tasks
// create
export const useCreateTask = () => {
  const router = useRouter();
  const basePath = useBasePath('tasks');
  return useMutationHandler<TaskPayloadModel, CreateTaskInputInterface>({
    path: taskBasePath,
    method: REQUEST_METHOD_POST,
    reload: false,
    onSuccess: (payload) => {
      if (payload.success) {
        router.push(`${basePath}/details/${payload.payload?._id}`).catch(console.log);
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
export const useCreateTaskVariant = () => {
  const router = useRouter();
  const basePath = useBasePath('task-variants');
  return useMutationHandler<TaskVariantPayloadModel, CreateTaskVariantInputInterface>({
    path: variantsBasePath,
    method: REQUEST_METHOD_POST,
    reload: false,
    onSuccess: (payload) => {
      if (payload.success) {
        router.push(`${basePath}/${payload.payload?._id}`).catch(console.log);
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
