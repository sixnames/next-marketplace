import { ShopProductBarcodeIntersectsModalInterface } from '../../components/Modal/ShopProductBarcodeIntersectsModal';
import { REQUEST_METHOD_PATCH } from '../../config/common';
import { SHOP_PRODUCT_BARCODE_INTERSECTS_MODAL } from '../../config/modalVariants';
import { useAppContext } from '../../context/appContext';
import { UpdateManyShopProductsInputType } from '../../db/dao/shopProduct/updateManyShopProducts';
import { ShopProductPayloadModel } from '../../db/dbModels';
import { useReloadListener } from '../useReloadListener';
import { useMutationHandler } from './useFetch';

const basePath = '/api/shop-product';

// update
export const useUpdateManyShopProducts = () => {
  const { showModal } = useAppContext();
  const { setReloadToTrue } = useReloadListener();
  return useMutationHandler<ShopProductPayloadModel, UpdateManyShopProductsInputType>({
    path: basePath,
    method: REQUEST_METHOD_PATCH,
    onError: (payload) => {
      if (payload && payload.barcodeDoubles) {
        showModal<ShopProductBarcodeIntersectsModalInterface>({
          variant: SHOP_PRODUCT_BARCODE_INTERSECTS_MODAL,
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
