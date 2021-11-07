import {
  REQUEST_METHOD_DELETE,
  REQUEST_METHOD_PATCH,
  REQUEST_METHOD_POST,
  ROUTE_CMS,
} from 'config/common';
import { CopyProductInputInterface } from 'db/dao/product/copyProduct';
import { CreateProductInputInterface } from 'db/dao/product/createProduct';
import { CreateProductWithSyncErrorInputInterface } from 'db/dao/product/createProductWithSyncError';
import { DeleteProductInputInterface } from 'db/dao/product/deleteProduct';
import { UpdateProductInputInterface } from 'db/dao/product/updateProduct';
import { UpdateProductAssetIndexInputInterface } from 'db/dao/product/updateProductAssetIndex';
import { UpdateProductCategoryInputInterface } from 'db/dao/product/updateProductCategory';
import { UpdateProductCounterInputInterface } from 'db/dao/product/updateProductCounter';
import { UpdateProductWithSyncErrorInputInterface } from 'db/dao/product/updateProductWithSyncError';
import { ProductPayloadModel } from 'db/dbModels';
import { ProductInterface } from 'db/uiInterfaces';
import { useMutationHandler } from 'hooks/mutations/useFetch';
import { useRouter } from 'next/router';

const basePath = '/api/product';

function getCmsProductUrl(product: ProductInterface) {
  return `${ROUTE_CMS}/rubrics/${product.rubricId}/products/product/${product._id}`;
}

// create
export const useCreateProduct = () => {
  const router = useRouter();
  return useMutationHandler<ProductPayloadModel, CreateProductInputInterface>({
    path: basePath,
    method: REQUEST_METHOD_POST,
    onSuccess: ({ payload }) => {
      if (payload) {
        router.push(getCmsProductUrl(payload)).catch(console.log);
      }
    },
  });
};

// update
export const useUpdateProduct = () => {
  return useMutationHandler<ProductPayloadModel, UpdateProductInputInterface>({
    path: basePath,
    method: REQUEST_METHOD_PATCH,
  });
};

// delete
export const useDeleteProduct = () => {
  return useMutationHandler<ProductPayloadModel, DeleteProductInputInterface>({
    path: basePath,
    method: REQUEST_METHOD_DELETE,
  });
};

// copy
export const useCopyProduct = () => {
  const router = useRouter();
  return useMutationHandler<ProductPayloadModel, CopyProductInputInterface>({
    path: `${basePath}/copy`,
    method: REQUEST_METHOD_POST,
    onSuccess: ({ payload }) => {
      if (payload) {
        router.push(getCmsProductUrl(payload)).catch(console.log);
      }
    },
  });
};

// create with sync error
export const useCreateProductWithSyncError = () => {
  const router = useRouter();
  return useMutationHandler<ProductPayloadModel, CreateProductWithSyncErrorInputInterface>({
    path: `${basePath}/sync-error`,
    method: REQUEST_METHOD_POST,
    onSuccess: ({ payload }) => {
      if (payload) {
        router.push(getCmsProductUrl(payload)).catch(console.log);
      }
    },
  });
};

// create with sync error
export const useUpdateProductWithSyncError = () => {
  const router = useRouter();
  return useMutationHandler<ProductPayloadModel, UpdateProductWithSyncErrorInputInterface>({
    path: `${basePath}/sync-error`,
    method: REQUEST_METHOD_PATCH,
    onSuccess: ({ payload }) => {
      if (payload) {
        router.push(getCmsProductUrl(payload)).catch(console.log);
      }
    },
  });
};

// update asset index
export const useUpdateProductAssetIndex = () => {
  return useMutationHandler<ProductPayloadModel, UpdateProductAssetIndexInputInterface>({
    path: `${basePath}/asset-index`,
    method: REQUEST_METHOD_PATCH,
  });
};

// update category
export const useUpdateProductCategory = () => {
  return useMutationHandler<ProductPayloadModel, UpdateProductCategoryInputInterface>({
    path: `${basePath}/category`,
    method: REQUEST_METHOD_PATCH,
  });
};

// update category visibility
export const useUpdateProductCategoryVisibility = () => {
  return useMutationHandler<ProductPayloadModel, UpdateProductCategoryInputInterface>({
    path: `${basePath}/category/visibility`,
    method: REQUEST_METHOD_PATCH,
  });
};

// update counter
export const useUpdateProductCounter = () => {
  return useMutationHandler<ProductPayloadModel, UpdateProductCounterInputInterface>({
    path: `${basePath}/counter`,
    method: REQUEST_METHOD_PATCH,
  });
};
