import { CreateBlogAttributeInputInterface } from 'db/dao/blog/createBlogAttribute';
import { CreateBlogPostInputInterface } from 'db/dao/blog/createBlogPost';
import { useRouter } from 'next/router';
import * as React from 'react';
import { REQUEST_METHOD_POST, ROUTE_CMS } from 'config/common';
import { BlogAttributePayloadModel, BlogPostPayloadModel } from 'db/dbModels';
import { useMutation, UseMutationConsumerPayload } from 'hooks/mutations/useFetch';

export const useCreateBlogPost = (): UseMutationConsumerPayload<
  BlogPostPayloadModel,
  CreateBlogPostInputInterface
> => {
  const router = useRouter();
  const [handle, payload] = useMutation<BlogPostPayloadModel>({
    input: '/api/blog/post',
    onSuccess: (payload) => {
      if (payload.payload) {
        router.push(`${ROUTE_CMS}/blog/post/${payload.payload._id}`).catch(console.log);
      }
    },
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

export const useCreateBlogAttribute = (): UseMutationConsumerPayload<
  BlogAttributePayloadModel,
  CreateBlogAttributeInputInterface
> => {
  const [handle, payload] = useMutation<BlogAttributePayloadModel>({
    input: '/api/blog/attribute',
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
