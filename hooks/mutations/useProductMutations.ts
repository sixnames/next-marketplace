import { useRouter } from 'next/router';
import { BarcodeIntersectsModalInterface } from '../../components/Modal/BarcodeIntersectsModal';
import {
  REQUEST_METHOD_DELETE,
  REQUEST_METHOD_PATCH,
  REQUEST_METHOD_POST,
} from '../../config/common';
import { BARCODE_INTERSECTS_MODAL } from '../../config/modalVariants';
import { useAppContext } from '../../context/appContext';
import { useNotificationsContext } from '../../context/notificationsContext';
import { CopyProductInputInterface } from '../../db/dao/product/copyProduct';
import { CreateProductInputInterface } from '../../db/dao/product/createProduct';
import { CreateProductWithSyncErrorInputInterface } from '../../db/dao/product/createProductWithSyncError';
import { DeleteProductInputInterface } from '../../db/dao/product/deleteProduct';
import { DeleteProductAssetInputInterface } from '../../db/dao/product/deleteProductAsset';
import { UpdateProductInputInterface } from '../../db/dao/product/updateProduct';
import { UpdateProductAssetIndexInputInterface } from '../../db/dao/product/updateProductAssetIndex';
import { UpdateProductCardContentInputInterface } from '../../db/dao/product/updateProductCardContent';
import { UpdateProductCategoryInputInterface } from '../../db/dao/product/updateProductCategory';
import { UpdateProductWithSyncErrorInputInterface } from '../../db/dao/product/updateProductWithSyncError';
import { ProductPayloadModel } from '../../db/dbModels';
import { getConsoleRubricLinks } from '../../lib/linkUtils';
import { useReloadListener } from '../useReloadListener';
import { useMutationHandler } from './useFetch';

const basePath = '/api/product';

// create
export const useCreateProduct = () => {
  const { showModal } = useAppContext();
  const { showErrorNotification } = useNotificationsContext();
  const router = useRouter();
  return useMutationHandler<ProductPayloadModel, CreateProductInputInterface>({
    path: basePath,
    method: REQUEST_METHOD_POST,
    reload: false,
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
        const { product } = getConsoleRubricLinks({
          rubricSlug: payload.rubricSlug,
          productId: `${payload._id}`,
        });
        router.push(product.root).catch(console.log);
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
interface UseDeleteProductInterface {
  reload?: boolean;
  redirectUrl?: string;
}

export const useDeleteProduct = (props?: UseDeleteProductInterface) => {
  const router = useRouter();

  return useMutationHandler<ProductPayloadModel, DeleteProductInputInterface>({
    path: basePath,
    method: REQUEST_METHOD_DELETE,
    reload: props?.reload,
    onSuccess: () => {
      if (props?.redirectUrl) {
        router.push(props.redirectUrl).catch(console.log);
      }
    },
  });
};

// copy
export const useCopyProduct = () => {
  const { showErrorNotification } = useNotificationsContext();
  const router = useRouter();
  return useMutationHandler<ProductPayloadModel, CopyProductInputInterface>({
    path: `${basePath}/copy`,
    method: REQUEST_METHOD_POST,
    reload: false,
    onSuccess: ({ payload, message }) => {
      if (payload) {
        const { product } = getConsoleRubricLinks({
          rubricSlug: payload.rubricSlug,
          productId: `${payload._id}`,
        });
        router.push(product.root).catch(console.log);
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
    reload: false,
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
        const { product } = getConsoleRubricLinks({
          rubricSlug: payload.rubricSlug,
          productId: `${payload._id}`,
        });
        router.push(product.root).catch(console.log);
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
    reload: false,
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
        const { product } = getConsoleRubricLinks({
          rubricSlug: payload.rubricSlug,
          productId: `${payload._id}`,
        });
        router.push(product.root).catch(console.log);
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

// update card content
export const useUpdateProductCardContent = () => {
  return useMutationHandler<ProductPayloadModel, UpdateProductCardContentInputInterface>({
    path: `${basePath}/card-content`,
    method: REQUEST_METHOD_PATCH,
  });
};
