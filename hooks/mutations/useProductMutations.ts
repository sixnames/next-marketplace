import { BarcodeIntersectsModalInterface } from 'components/Modal/BarcodeIntertsectsModal';
import {
  REQUEST_METHOD_DELETE,
  REQUEST_METHOD_PATCH,
  REQUEST_METHOD_POST,
  ROUTE_CMS,
} from 'config/common';
import { BARCODE_INTERSECTS_MODAL } from 'config/modalVariants';
import { useAppContext } from 'context/appContext';
import { useNotificationsContext } from 'context/notificationsContext';
import { CopyProductInputInterface } from 'db/dao/product/copyProduct';
import { CreateProductInputInterface } from 'db/dao/product/createProduct';
import { CreateProductWithSyncErrorInputInterface } from 'db/dao/product/createProductWithSyncError';
import { DeleteProductInputInterface } from 'db/dao/product/deleteProduct';
import { DeleteProductAssetInputInterface } from 'db/dao/product/deleteProductAsset';
import { UpdateProductInputInterface } from 'db/dao/product/updateProduct';
import { UpdateProductAssetIndexInputInterface } from 'db/dao/product/updateProductAssetIndex';
import { UpdateProductCategoryInputInterface } from 'db/dao/product/updateProductCategory';
import { UpdateProductWithSyncErrorInputInterface } from 'db/dao/product/updateProductWithSyncError';
import { ProductPayloadModel } from 'db/dbModels';
import { ProductInterface } from 'db/uiInterfaces';
import { useMutationHandler } from 'hooks/mutations/useFetch';
import { useReloadListener } from 'hooks/useReloadListener';
import { useRouter } from 'next/router';

const basePath = '/api/product';

function getCmsProductUrl(product: ProductInterface) {
  return `${ROUTE_CMS}/rubrics/${product.rubricId}/products/product/${product._id}`;
}

// create
export const useCreateProduct = () => {
  const { showModal } = useAppContext();
  const { showErrorNotification } = useNotificationsContext();
  const router = useRouter();
  return useMutationHandler<ProductPayloadModel, CreateProductInputInterface>({
    path: basePath,
    method: REQUEST_METHOD_POST,
    onError: ({ barcodeDoubles }) => {
      if (barcodeDoubles) {
        showModal<BarcodeIntersectsModalInterface>({
          variant: BARCODE_INTERSECTS_MODAL,
          props: {
            barcodeDoubles,
          },
        });
        return;
      }
    },
    onSuccess: ({ payload, message }) => {
      if (payload) {
        router.push(getCmsProductUrl(payload)).catch(console.log);
      } else {
        showErrorNotification({ title: message });
      }
    },
  });
};

// update
export const useUpdateProduct = () => {
  const { showModal } = useAppContext();
  const { setReloadToTrue } = useReloadListener();
  return useMutationHandler<ProductPayloadModel, UpdateProductInputInterface>({
    path: basePath,
    method: REQUEST_METHOD_PATCH,
    onError: ({ barcodeDoubles }) => {
      if (barcodeDoubles) {
        showModal<BarcodeIntersectsModalInterface>({
          variant: BARCODE_INTERSECTS_MODAL,
          props: {
            barcodeDoubles,
          },
        });
        return;
      }
    },
    onSuccess: () => {
      setReloadToTrue();
    },
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
  const { showErrorNotification } = useNotificationsContext();
  const router = useRouter();
  return useMutationHandler<ProductPayloadModel, CopyProductInputInterface>({
    path: `${basePath}/copy`,
    method: REQUEST_METHOD_POST,
    onSuccess: ({ payload, message }) => {
      if (payload) {
        router.push(getCmsProductUrl(payload)).catch(console.log);
      } else {
        showErrorNotification({ title: message });
      }
    },
  });
};

// create with sync error
export const useCreateProductWithSyncError = () => {
  const { showModal } = useAppContext();
  const { showErrorNotification } = useNotificationsContext();
  const router = useRouter();
  return useMutationHandler<ProductPayloadModel, CreateProductWithSyncErrorInputInterface>({
    path: `${basePath}/sync-error`,
    method: REQUEST_METHOD_POST,
    onError: ({ barcodeDoubles }) => {
      if (barcodeDoubles) {
        showModal<BarcodeIntersectsModalInterface>({
          variant: BARCODE_INTERSECTS_MODAL,
          props: {
            barcodeDoubles,
          },
        });
        return;
      }
    },
    onSuccess: ({ payload, message }) => {
      if (payload) {
        router.push(getCmsProductUrl(payload)).catch(console.log);
      } else {
        showErrorNotification({ title: message });
      }
    },
  });
};

// create with sync error
export const useUpdateProductWithSyncError = () => {
  const { showModal } = useAppContext();
  const router = useRouter();
  return useMutationHandler<ProductPayloadModel, UpdateProductWithSyncErrorInputInterface>({
    path: `${basePath}/sync-error`,
    method: REQUEST_METHOD_PATCH,
    onError: ({ barcodeDoubles }) => {
      if (barcodeDoubles) {
        showModal<BarcodeIntersectsModalInterface>({
          variant: BARCODE_INTERSECTS_MODAL,
          props: {
            barcodeDoubles,
          },
        });
        return;
      }
    },
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

// delete asset
export const useDeleteProductAsset = () => {
  return useMutationHandler<ProductPayloadModel, DeleteProductAssetInputInterface>({
    path: `${basePath}/delete-asset`,
    method: REQUEST_METHOD_DELETE,
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
