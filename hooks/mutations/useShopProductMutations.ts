import { useAppContext } from '../../components/context/appContext';
import { ShopProductBarcodeIntersectsModalInterface } from '../../components/Modal/ShopProductBarcodeIntersectsModal';
import { UpdateManyShopProductsInputType } from '../../db/dao/shopProduct/updateManyShopProducts';
import { ShopProductPayloadModel } from '../../db/dbModels';
import { REQUEST_METHOD_PATCH } from '../../lib/config/common';
import { SHOP_PRODUCT_BARCODE_INTERSECTS_MODAL } from '../../lib/config/modalVariants';
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
