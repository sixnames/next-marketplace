import { DeleteUserCategoryInputInterface } from 'db/dao/userCategory/deleteUserCategory';
import { UpdateUserCategoryInputInterface } from 'db/dao/userCategory/updateUserCategory';
import * as React from 'react';
import { REQUEST_METHOD_DELETE, REQUEST_METHOD_PATCH, REQUEST_METHOD_POST } from 'config/common';
import { CreateUserCategoryInputInterface } from 'db/dao/userCategory/createUserCategory';
import { UserCategoryPayloadModel } from 'db/dbModels';
import { useMutation, UseMutationConsumerPayload } from 'hooks/mutations/useFetch';

// create
export const useCreateUserCategory = (): UseMutationConsumerPayload<
  UserCategoryPayloadModel,
  CreateUserCategoryInputInterface
> => {
  const [handle, payload] = useMutation({
    input: '/api/user-category',
    reload: true,
  });

  const handler = React.useCallback(
    async (args: CreateUserCategoryInputInterface) => {
      const payload = await handle({
        method: REQUEST_METHOD_POST,
        body: JSON.stringify(args),
      });
      return payload;
    },
    [handle],
  );

  return [handler, payload];
};

// update
export const useUpdateUserCategory = (): UseMutationConsumerPayload<
  UserCategoryPayloadModel,
  UpdateUserCategoryInputInterface
> => {
  const [handle, payload] = useMutation({
    input: '/api/user-category',
    reload: true,
  });

  const handler = React.useCallback(
    async (args: UpdateUserCategoryInputInterface) => {
      const payload = await handle({
        method: REQUEST_METHOD_PATCH,
        body: JSON.stringify(args),
      });
      return payload;
    },
    [handle],
  );

  return [handler, payload];
};

// delete
export const useDeleteUserCategory = (): UseMutationConsumerPayload<
  UserCategoryPayloadModel,
  DeleteUserCategoryInputInterface
> => {
  const [handle, payload] = useMutation({
    input: '/api/user-category',
    reload: true,
  });

  const handler = React.useCallback(
    async (args: DeleteUserCategoryInputInterface) => {
      const payload = await handle({
        method: REQUEST_METHOD_DELETE,
        body: JSON.stringify(args),
      });
      return payload;
    },
    [handle],
  );

  return [handler, payload];
};
