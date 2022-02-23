import { useAppContext } from 'components/context/appContext';
import { useNotificationsContext } from 'components/context/notificationsContext';
import { BarcodeIntersectsModalInterface } from 'components/Modal/BarcodeIntersectsModal';
import { AddProductToVariantInputInterface } from 'db/dao/product/addProductToVariant';
import { CopyProductInputInterface } from 'db/dao/product/copyProduct';
import { CreateProductInputInterface } from 'db/dao/product/createProduct';
import { CreateProductVariantInputInterface } from 'db/dao/product/createProductVariant';
import { CreateProductWithSyncErrorInputInterface } from 'db/dao/product/createProductWithSyncError';
import { DeleteProductInputInterface } from 'db/dao/product/deleteProduct';
import { DeleteProductAssetInputInterface } from 'db/dao/product/deleteProductAsset';
import { DeleteProductFromVariantInputInterface } from 'db/dao/product/deleteProductFromVariant';
import { UpdateProductInputInterface } from 'db/dao/product/updateProduct';
import { UpdateProductAssetIndexInputInterface } from 'db/dao/product/updateProductAssetIndex';
import { UpdateProductBrandInputInterface } from 'db/dao/product/updateProductBrand';
import { UpdateProductBrandCollectionInputInterface } from 'db/dao/product/updateProductBrandCollection';
import { UpdateProductCardContentInputInterface } from 'db/dao/product/updateProductCardContent';
import { UpdateProductCategoryInputInterface } from 'db/dao/product/updateProductCategory';
import { UpdateProductManufacturerInputInterface } from 'db/dao/product/updateProductManufacturer';
import { UpdateProductNumberAttributeInputInterface } from 'db/dao/product/updateProductNumberAttribute';
import { UpdateProductSelectAttributeInputInterface } from 'db/dao/product/updateProductSelectAttribute';
import { UpdateProductTextAttributeInputInterface } from 'db/dao/product/updateProductTextAttribute';
import { UpdateProductWithSyncErrorInputInterface } from 'db/dao/product/updateProductWithSyncError';
import { ProductPayloadModel } from 'db/dbModels';
import {
  REQUEST_METHOD_DELETE,
  REQUEST_METHOD_PATCH,
  REQUEST_METHOD_POST,
} from 'lib/config/common';
import { BARCODE_INTERSECTS_MODAL } from 'lib/config/modalVariants';

import { useRouter } from 'next/router';
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
    onError: (payload) => {
      if (payload && payload.barcodeDoubles) {
        showModal<BarcodeIntersectsModalInterface>({
          variant: BARCODE_INTERSECTS_MODAL,
          props: {
            barcodeDoubles: payload.barcodeDoubles,
          },
        });
        return;
      }
    },
    onSuccess: ({ payload, message }) => {
      if (payload) {
        const { product } = getProjectLinks({
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
    onError: (payload) => {
      if (payload && payload.barcodeDoubles) {
        showModal<BarcodeIntersectsModalInterface>({
          variant: BARCODE_INTERSECTS_MODAL,
          props: {
            barcodeDoubles: payload.barcodeDoubles,
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
        const { product } = getProjectLinks({
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
    onError: (payload) => {
      if (payload && payload.barcodeDoubles) {
        showModal<BarcodeIntersectsModalInterface>({
          variant: BARCODE_INTERSECTS_MODAL,
          props: {
            barcodeDoubles: payload.barcodeDoubles,
          },
        });
        return;
      }
    },
    onSuccess: ({ payload, message }) => {
      if (payload) {
        const { product } = getProjectLinks({
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

// update with sync error
export const useUpdateProductWithSyncError = () => {
  const { showModal } = useAppContext();
  const router = useRouter();
  return useMutationHandler<ProductPayloadModel, UpdateProductWithSyncErrorInputInterface>({
    path: `${basePath}/sync-error`,
    method: REQUEST_METHOD_PATCH,
    reload: false,
    onError: (payload) => {
      if (payload && payload.barcodeDoubles) {
        showModal<BarcodeIntersectsModalInterface>({
          variant: BARCODE_INTERSECTS_MODAL,
          props: {
            barcodeDoubles: payload.barcodeDoubles,
          },
        });
        return;
      }
    },
    onSuccess: ({ payload }) => {
      if (payload) {
        const { product } = getProjectLinks({
          rubricSlug: payload.rubricSlug,
          productId: `${payload._id}`,
        });
        router.push(product.root).catch(console.log);
      }
    },
  });
};

// attributes
export const useUpdateProductBrand = () => {
  return useMutationHandler<ProductPayloadModel, UpdateProductBrandInputInterface>({
    path: `${basePath}/attributes/brand`,
    method: REQUEST_METHOD_PATCH,
  });
};

export const useUpdateProductBrandCollection = () => {
  return useMutationHandler<ProductPayloadModel, UpdateProductBrandCollectionInputInterface>({
    path: `${basePath}/attributes/brand-collection`,
    method: REQUEST_METHOD_PATCH,
  });
};

export const useUpdateProductManufacturer = () => {
  return useMutationHandler<ProductPayloadModel, UpdateProductManufacturerInputInterface>({
    path: `${basePath}/attributes/manufacturer`,
    method: REQUEST_METHOD_PATCH,
  });
};

export const useUpdateProductNumberAttribute = () => {
  return useMutationHandler<ProductPayloadModel, UpdateProductNumberAttributeInputInterface>({
    path: `${basePath}/attributes/number`,
    method: REQUEST_METHOD_PATCH,
  });
};

export const useUpdateProductSelectAttribute = () => {
  return useMutationHandler<ProductPayloadModel, UpdateProductSelectAttributeInputInterface>({
    path: `${basePath}/attributes/select`,
    method: REQUEST_METHOD_PATCH,
  });
};

export const useUpdateProductTextAttribute = () => {
  return useMutationHandler<ProductPayloadModel, UpdateProductTextAttributeInputInterface>({
    path: `${basePath}/attributes/text`,
    method: REQUEST_METHOD_PATCH,
  });
};

// variants
export const useCreateProductVariant = () => {
  return useMutationHandler<ProductPayloadModel, CreateProductVariantInputInterface>({
    path: `${basePath}/variants`,
    method: REQUEST_METHOD_POST,
  });
};

export const useAddProductToVariant = () => {
  return useMutationHandler<ProductPayloadModel, AddProductToVariantInputInterface>({
    path: `${basePath}/variants`,
    method: REQUEST_METHOD_PATCH,
  });
};

export const useDeleteProductFromVariant = () => {
  return useMutationHandler<ProductPayloadModel, DeleteProductFromVariantInputInterface>({
    path: `${basePath}/variants`,
    method: REQUEST_METHOD_DELETE,
  });
};

// update asset index
export const useUpdateProductAssetIndex = () => {
  return useMutationHandler<ProductPayloadModel, UpdateProductAssetIndexInputInterface>({
    path: `${basePath}/assets`,
    method: REQUEST_METHOD_PATCH,
  });
};

// delete asset
export const useDeleteProductAsset = () => {
  return useMutationHandler<ProductPayloadModel, DeleteProductAssetInputInterface>({
    path: `${basePath}/assets`,
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
