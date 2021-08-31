import { CreateBlogAttributeInputInterface } from 'db/dao/blog/createBlogAttribute';
import { CreateBlogPostInputInterface } from 'db/dao/blog/createBlogPost';
import { DeleteBlogAttributeInputInterface } from 'db/dao/blog/deleteBlogAttribute';
import { DeleteBlogPostInputInterface } from 'db/dao/blog/deleteBlogPost';
import { DeleteBlogPostPreviewImageInterface } from 'db/dao/blog/deletePostPreviewImage';
import { UpdateBlogAttributeInputInterface } from 'db/dao/blog/updateBlogAttribute';
import { UpdateBlogPostInputInterface } from 'db/dao/blog/updateBlogPost';
import { UpdateBlogPostAttributeInterface } from 'db/dao/blog/updateBlogPostAttribute';
import { UploadBlogPostAssetInputInterface } from 'db/dao/blog/uploadPostAsset';
import { UpdateBlogPostPreviewInputInterface } from 'db/dao/blog/uploadPostPreviewImage';
import { useRouter } from 'next/router';
import * as React from 'react';
import {
  REQUEST_METHOD_DELETE,
  REQUEST_METHOD_PATCH,
  REQUEST_METHOD_POST,
  ROUTE_BLOG,
} from 'config/common';
import {
  BlogAttributePayloadModel,
  BlogPostPayloadModel,
  ConstructorAssetPayloadModel,
} from 'db/dbModels';
import { useMutation, UseMutationConsumerPayload } from 'hooks/mutations/useFetch';

// post
export const useCreateBlogPost = (
  basePath: string,
): UseMutationConsumerPayload<BlogPostPayloadModel, CreateBlogPostInputInterface> => {
  const router = useRouter();
  const [handle, payload] = useMutation<BlogPostPayloadModel>({
    input: '/api/blog/post',
    onSuccess: (payload) => {
      console.log(payload);
      if (payload.payload) {
        router.push(`${basePath}${ROUTE_BLOG}/post/${payload.payload._id}`).catch(console.log);
      }
    },
  });

  const handler = React.useCallback(
    async (args: CreateBlogPostInputInterface) => {
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

export const useUpdateBlogPost = (): UseMutationConsumerPayload<
  BlogPostPayloadModel,
  UpdateBlogPostInputInterface
> => {
  const [handle, payload] = useMutation<BlogPostPayloadModel>({
    input: '/api/blog/post',
    reload: true,
  });

  const handler = React.useCallback(
    async (args: UpdateBlogPostInputInterface) => {
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

export const useUpdateBlogPostAttribute = (): UseMutationConsumerPayload<
  BlogPostPayloadModel,
  UpdateBlogPostAttributeInterface
> => {
  const [handle, payload] = useMutation<BlogPostPayloadModel>({
    input: '/api/blog/update-post-attribute',
    reload: true,
  });

  const handler = React.useCallback(
    async (args: UpdateBlogPostAttributeInterface) => {
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

export const useDeleteBlogPost = (): UseMutationConsumerPayload<
  BlogPostPayloadModel,
  DeleteBlogPostInputInterface
> => {
  const [handle, payload] = useMutation<BlogPostPayloadModel>({
    input: '/api/blog/post',
    reload: true,
  });

  const handler = React.useCallback(
    async (args: DeleteBlogPostInputInterface) => {
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

// delete post preview image
export const useDeleteBlogPostPreviewImage = (): UseMutationConsumerPayload<
  BlogPostPayloadModel,
  DeleteBlogPostPreviewImageInterface
> => {
  const [handle, payload] = useMutation<BlogPostPayloadModel>({
    input: '/api/blog/post-preview-image',
    reload: true,
  });

  const handler = React.useCallback(
    async (args: DeleteBlogPostPreviewImageInterface) => {
      const formData = new FormData();
      formData.append('blogPostId', `${args.blogPostId}`);

      const payload = await handle({
        method: REQUEST_METHOD_DELETE,
        body: formData,
      });
      return payload;
    },
    [handle],
  );

  return [handler, payload];
};

// upload post preview image
export const useUploadBlogPostPreviewImage = (): UseMutationConsumerPayload<
  BlogPostPayloadModel,
  UpdateBlogPostPreviewInputInterface
> => {
  const [handle, payload] = useMutation<BlogPostPayloadModel>({
    input: '/api/blog/post-preview-image',
    reload: true,
  });

  const handler = React.useCallback(
    async (args: UpdateBlogPostPreviewInputInterface) => {
      const formData = new FormData();
      if (args.assets) {
        formData.append('assets', args.assets[0]);
      }
      formData.append('blogPostId', `${args.blogPostId}`);

      const payload = await handle({
        method: REQUEST_METHOD_PATCH,
        body: formData,
      });
      return payload;
    },
    [handle],
  );

  return [handler, payload];
};

// upload post asset
export const useUploadBlogPostAsset = (): UseMutationConsumerPayload<
  ConstructorAssetPayloadModel,
  UploadBlogPostAssetInputInterface
> => {
  const [handle, payload] = useMutation<ConstructorAssetPayloadModel>({
    input: '/api/blog/add-post-asset',
  });

  const handler = React.useCallback(
    async (args: UploadBlogPostAssetInputInterface) => {
      const formData = new FormData();
      if (args.assets) {
        formData.append('assets', args.assets[0]);
      }
      formData.append('blogPostId', `${args.blogPostId}`);

      const payload = await handle({
        method: REQUEST_METHOD_PATCH,
        body: formData,
      });

      return payload;
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
    async (args) => {
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

export const useUpdateBlogAttribute = (): UseMutationConsumerPayload<
  BlogAttributePayloadModel,
  UpdateBlogAttributeInputInterface
> => {
  const [handle, payload] = useMutation<BlogAttributePayloadModel>({
    input: '/api/blog/attribute',
    reload: true,
  });

  const handler = React.useCallback(
    async (args) => {
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

export const useDeleteBlogAttribute = (): UseMutationConsumerPayload<
  BlogAttributePayloadModel,
  DeleteBlogAttributeInputInterface
> => {
  const [handle, payload] = useMutation<BlogAttributePayloadModel>({
    input: '/api/blog/attribute',
    reload: true,
  });

  const handler = React.useCallback(
    async (args) => {
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
