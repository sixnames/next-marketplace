import {
  REQUEST_METHOD_DELETE,
  REQUEST_METHOD_PATCH,
  REQUEST_METHOD_POST,
} from '../../config/common';
import { CreateUserCategoryInputInterface } from '../../db/dao/userCategory/createUserCategory';
import { DeleteUserCategoryInputInterface } from '../../db/dao/userCategory/deleteUserCategory';
import { UpdateUserCategoryInputInterface } from '../../db/dao/userCategory/updateUserCategory';
import { UserCategoryPayloadModel } from '../../db/dbModels';
import { useMutationHandler } from './useFetch';

const basePath = '/api/user-category';

// create
export const useCreateUserCategory = () => {
  return useMutationHandler<UserCategoryPayloadModel, CreateUserCategoryInputInterface>({
    path: basePath,
    method: REQUEST_METHOD_POST,
  });
};

// update
export const useUpdateUserCategory = () => {
  return useMutationHandler<UserCategoryPayloadModel, UpdateUserCategoryInputInterface>({
    path: basePath,
    method: REQUEST_METHOD_PATCH,
  });
};

// delete
export const useDeleteUserCategory = () => {
  return useMutationHandler<UserCategoryPayloadModel, DeleteUserCategoryInputInterface>({
    path: basePath,
    method: REQUEST_METHOD_DELETE,
  });
};
