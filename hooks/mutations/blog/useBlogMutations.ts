import { CreateBlogAttributeInputInterface } from 'db/dao/blog/createBlogAttribute';
import { CreateBlogPostInputInterface } from 'db/dao/blog/createBlogPost';
import { DeleteBlogAttributeInputInterface } from 'db/dao/blog/deleteBlogAttribute';
import { DeleteBlogPostInputInterface } from 'db/dao/blog/deleteBlogPost';
import { UpdateBlogAttributeInputInterface } from 'db/dao/blog/updateBlogAttribute';
import { UpdateBlogPostInputInterface } from 'db/dao/blog/updateBlogPost';
import { useRouter } from 'next/router';
import * as React from 'react';
import {
  REQUEST_METHOD_DELETE,
  REQUEST_METHOD_PATCH,
  REQUEST_METHOD_POST,
  ROUTE_CMS,
} from 'config/common';
import { BlogAttributePayloadModel, BlogPostPayloadModel } from 'db/dbModels';
import { useMutation, UseMutationConsumerPayload } from 'hooks/mutations/useFetch';

// post
export const useCreateBlogPost = (): UseMutationConsumerPayload<
  BlogPostPayloadModel,
  CreateBlogPostInputInterface
> => {
  const router = useRouter();
  const [handle, payload] = useMutation<BlogPostPayloadModel>({
    input: '/api/blog/post',
    onSuccess: (payload) => {
      console.log(payload);
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

export const useUpdateBlogPost = (): UseMutationConsumerPayload<
  BlogPostPayloadModel,
  UpdateBlogPostInputInterface
> => {
  const [handle, payload] = useMutation<BlogPostPayloadModel>({
    input: '/api/blog/post',
    reload: true,
  });

  const handler = React.useCallback(
    (args) => {
      handle({
        method: REQUEST_METHOD_PATCH,
        body: JSON.stringify(args),
      });
    },
    [handle],
  );

  return [handler, payload];
};

export const useDeleteBlogPost = (): UseMutationConsumerPayload<
  BlogPostPayloadModel,
  DeleteBlogPostInputInterface
> => {
  const [handle, payload] = useMutation<BlogPostPayloadModel>({
    input: '/api/blog/post',
    reload: true,
  });

  const handler = React.useCallback(
    (args) => {
      handle({
        method: REQUEST_METHOD_DELETE,
        body: JSON.stringify(args),
      });
    },
    [handle],
  );

  return [handler, payload];
};

// delete post preview image
export const useDeleteBlogPostPreviewImage = (): UseMutationConsumerPayload<
  BlogPostPayloadModel,
  DeleteBlogPostInputInterface
> => {
  const [handle, payload] = useMutation<BlogPostPayloadModel>({
    input: '/api/blog/post-preview-image',
    reload: true,
  });

  const handler = React.useCallback(
    (args) => {
      const formData = new FormData();
      formData.append('assets', args.files[0]);
      formData.append('postId', `${args.postId}`);

      handle({
        method: REQUEST_METHOD_DELETE,
        body: formData,
      });
    },
    [handle],
  );

  return [handler, payload];
};

// attribute
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

export const useUpdateBlogAttribute = (): UseMutationConsumerPayload<
  BlogAttributePayloadModel,
  UpdateBlogAttributeInputInterface
> => {
  const [handle, payload] = useMutation<BlogAttributePayloadModel>({
    input: '/api/blog/attribute',
    reload: true,
  });

  const handler = React.useCallback(
    (args) => {
      handle({
        method: REQUEST_METHOD_PATCH,
        body: JSON.stringify(args),
      });
    },
    [handle],
  );

  return [handler, payload];
};

export const useDeleteBlogAttribute = (): UseMutationConsumerPayload<
  BlogAttributePayloadModel,
  DeleteBlogAttributeInputInterface
> => {
  const [handle, payload] = useMutation<BlogAttributePayloadModel>({
    input: '/api/blog/attribute',
    reload: true,
  });

  const handler = React.useCallback(
    (args) => {
      handle({
        method: REQUEST_METHOD_DELETE,
        body: JSON.stringify(args),
      });
    },
    [handle],
  );

  return [handler, payload];
};
