import { CreateBlogPostInputInterface } from 'db/dao/blog/createBlogPost';
import * as React from 'react';
import { REQUEST_METHOD_POST } from 'config/common';
import { BlogPostPayloadModel } from 'db/dbModels';
import { useMutation, UseMutationConsumerPayload } from 'hooks/mutations/useFetch';

export const useCreateBlogPost = (): UseMutationConsumerPayload<
  BlogPostPayloadModel,
  CreateBlogPostInputInterface
> => {
  const [handle, payload] = useMutation<BlogPostPayloadModel>({
    input: '/api/blog/post',
    reload: true,
  });

  const handler = React.useCallback(
    (args) => {
      handle({
        method: REQUEST_METHOD_POST,
        body: JSON.stringify(args),
      });
    },
    [handle],
  );

  return [handler, payload];
};
