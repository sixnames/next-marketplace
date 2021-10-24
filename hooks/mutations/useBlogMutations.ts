import { AddBlogPostLikeInputInterface } from 'db/dao/blog/addPostLike';
import { CreateBlogAttributeInputInterface } from 'db/dao/blog/createBlogAttribute';
import { CreateBlogPostInputInterface } from 'db/dao/blog/createBlogPost';
import { DeleteBlogAttributeInputInterface } from 'db/dao/blog/deleteBlogAttribute';
import { DeleteBlogPostInputInterface } from 'db/dao/blog/deleteBlogPost';
import { DeleteBlogPostPreviewImageInterface } from 'db/dao/blog/deletePostPreviewImage';
import { UpdateBlogAttributeInputInterface } from 'db/dao/blog/updateBlogAttribute';
import { UpdateBlogPostInputInterface } from 'db/dao/blog/updateBlogPost';
import { UpdateBlogPostAttributeInterface } from 'db/dao/blog/updateBlogPostAttribute';
import { useRouter } from 'next/router';
import {
  REQUEST_METHOD_DELETE,
  REQUEST_METHOD_PATCH,
  REQUEST_METHOD_POST,
  ROUTE_BLOG,
} from 'config/common';
import { BlogAttributePayloadModel, BlogPostPayloadModel } from 'db/dbModels';
import { UseMutationConsumerPayload, useMutationHandler } from 'hooks/mutations/useFetch';

const basePath = '/api/blog';

// likes
export const useCreateBlogPostLike = () => {
  return useMutationHandler<BlogPostPayloadModel, AddBlogPostLikeInputInterface>({
    path: `${basePath}/add-post-like`,
    method: REQUEST_METHOD_PATCH,
  });
};

// post
export const useCreateBlogPost = (redirectPath: string) => {
  const router = useRouter();
  return useMutationHandler<BlogPostPayloadModel, CreateBlogPostInputInterface>({
    path: `${basePath}/post`,
    method: REQUEST_METHOD_POST,
    reload: false,
    onSuccess: (payload) => {
      if (payload.payload) {
        router.push(`${redirectPath}${ROUTE_BLOG}/post/${payload.payload._id}`).catch(console.log);
      }
    },
  });
};

export const useUpdateBlogPost = (): UseMutationConsumerPayload<
  BlogPostPayloadModel,
  UpdateBlogPostInputInterface
> => {
  return useMutationHandler<BlogPostPayloadModel, UpdateBlogPostInputInterface>({
    path: `${basePath}/post`,
    method: REQUEST_METHOD_PATCH,
  });
};

export const useUpdateBlogPostAttribute = (): UseMutationConsumerPayload<
  BlogPostPayloadModel,
  UpdateBlogPostAttributeInterface
> => {
  return useMutationHandler<BlogPostPayloadModel, UpdateBlogPostAttributeInterface>({
    path: `${basePath}/update-post-attribute`,
    method: REQUEST_METHOD_PATCH,
  });
};

export const useDeleteBlogPost = (): UseMutationConsumerPayload<
  BlogPostPayloadModel,
  DeleteBlogPostInputInterface
> => {
  return useMutationHandler<BlogPostPayloadModel, DeleteBlogPostInputInterface>({
    path: `${basePath}/post`,
    method: REQUEST_METHOD_DELETE,
  });
};

// delete post preview image
export const useDeleteBlogPostPreviewImage = (): UseMutationConsumerPayload<
  BlogPostPayloadModel,
  DeleteBlogPostPreviewImageInterface
> => {
  return useMutationHandler<BlogPostPayloadModel, DeleteBlogPostPreviewImageInterface>({
    path: `${basePath}/delete-preview-image`,
    method: REQUEST_METHOD_DELETE,
  });
};

// attribute
export const useCreateBlogAttribute = (): UseMutationConsumerPayload<
  BlogAttributePayloadModel,
  CreateBlogAttributeInputInterface
> => {
  return useMutationHandler<BlogAttributePayloadModel, CreateBlogAttributeInputInterface>({
    path: `${basePath}/attribute`,
    method: REQUEST_METHOD_POST,
  });
};

export const useUpdateBlogAttribute = (): UseMutationConsumerPayload<
  BlogAttributePayloadModel,
  UpdateBlogAttributeInputInterface
> => {
  return useMutationHandler<BlogAttributePayloadModel, UpdateBlogAttributeInputInterface>({
    path: `${basePath}/attribute`,
    method: REQUEST_METHOD_PATCH,
  });
};

export const useDeleteBlogAttribute = (): UseMutationConsumerPayload<
  BlogAttributePayloadModel,
  DeleteBlogAttributeInputInterface
> => {
  return useMutationHandler<BlogAttributePayloadModel, DeleteBlogAttributeInputInterface>({
    path: `${basePath}/attribute`,
    method: REQUEST_METHOD_DELETE,
  });
};
