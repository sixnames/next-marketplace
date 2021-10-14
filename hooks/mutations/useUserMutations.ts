import { REQUEST_METHOD_DELETE, REQUEST_METHOD_PATCH, REQUEST_METHOD_POST } from 'config/common';
import { DeleteUserInputInterface } from 'db/dao/user/deleteUser';
import { UpdateUserInputInterface } from 'db/dao/user/updateUser';
import { UpdateUserPasswordInputInterface } from 'db/dao/user/updateUserPassword';
import { CreateUserInputInterface } from 'db/dao/user/createUser';
import { UserPayloadModel } from 'db/dbModels';
import { useMutationHandler } from 'hooks/mutations/useFetch';

const basePath = 'api/user';

export const useCreatUserMutation = () => {
  return useMutationHandler<UserPayloadModel, CreateUserInputInterface>({
    path: basePath,
    method: REQUEST_METHOD_POST,
  });
};

export const useUpdateUserMutation = () => {
  return useMutationHandler<UserPayloadModel, UpdateUserInputInterface>({
    path: basePath,
    method: REQUEST_METHOD_PATCH,
  });
};

export const useDeleteUserMutation = () => {
  return useMutationHandler<UserPayloadModel, DeleteUserInputInterface>({
    path: basePath,
    method: REQUEST_METHOD_DELETE,
  });
};

export const useUpdateUserPasswordMutation = () => {
  return useMutationHandler<UserPayloadModel, UpdateUserPasswordInputInterface>({
    path: basePath,
    method: REQUEST_METHOD_DELETE,
  });
};
