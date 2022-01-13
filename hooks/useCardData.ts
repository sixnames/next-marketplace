import * as React from 'react';
import { DEFAULT_CITY } from '../config/common';
import { useConfigContext } from '../context/configContext';
import { useSiteContext } from '../context/siteContext';
import { InitialCardDataInterface, ProductAttributeInterface } from '../db/uiInterfaces';
import {
  AddProductToCartInput,
  AddShoplessProductToCartInput,
} from '../generated/apolloComponents';
import { alwaysArray } from '../lib/arrayUtils';
import { noNaN } from '../lib/numbers';
import useGetSimilarProducts, {
  UseGetSimilarProductsPayloadInterface,
} from './useGetSimilarProducts';
import useUpdateCardCounter from './useUpdateCardCounter';

interface UseCardDataPayloadInterface
  extends InitialCardDataInterface,
    UseGetSimilarProductsPayloadInterface {
  addShoplessProductToCart: (input: AddShoplessProductToCartInput) => void;
  addProductToCart: (input: AddProductToCartInput) => void;
  visibleListFeatures: ProductAttributeInterface[];
  visibleListFeaturesCount: number;
}

interface UseCardDataInterface {
  cardData: InitialCardDataInterface;
  companySlug?: string | null;
}

const useCardData = ({
  cardData,
  companySlug,
}: UseCardDataInterface): UseCardDataPayloadInterface => {
  const shopsCounterPostfix = noNaN(cardData.shopsCount) > 1 ? 'магазинах' : 'магазине';
  const isShopless = noNaN(cardData.shopsCount) < 1;
  const { addShoplessProductToCart, addProductToCart } = useSiteContext();
  const { configs, currentCity } = useConfigContext();

  // visible list features slice
  const visibleListFeaturesCount = React.useMemo(() => {
    return configs.cardListFeaturesCount;
  }, [configs]);

  const visibleListFeatures = React.useMemo(() => {
    return cardData.listFeatures.slice(0, visibleListFeaturesCount);
  }, [cardData.listFeatures, visibleListFeaturesCount]);

  // similar products
  const { similarProducts, loading } = useGetSimilarProducts({
    productId: cardData.product._id,
  });

  // update product counters
  useUpdateCardCounter({
    companySlug,
    shopProductIds: alwaysArray(cardData.product.shopProductIds),
    citySlug: currentCity?.slug || DEFAULT_CITY,
  });

  return {
    ...cardData,
    shopsCounterPostfix,
    isShopless,
    addShoplessProductToCart,
    addProductToCart,
    visibleListFeaturesCount,
    visibleListFeatures,
    loading,
    similarProducts,
  };
};

export default useCardData;
