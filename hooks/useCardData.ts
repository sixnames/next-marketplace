import { useConfigContext } from 'context/configContext';
import { useSiteContext } from 'context/siteContext';
import { InitialCardDataInterface, ProductAttributeInterface } from 'db/uiInterfaces';
import { AddProductToCartInput, AddShoplessProductToCartInput } from 'generated/apolloComponents';
import useGetSimilarProducts, {
  UseGetSimilarProductsPayloadInterface,
} from 'hooks/useGetSimilarProducts';
import useUpdateCardCounter from 'hooks/useUpdateCardCounter';
import { noNaN } from 'lib/numbers';
import * as React from 'react';

interface UseCardDataPayloadInterface
  extends InitialCardDataInterface,
    UseGetSimilarProductsPayloadInterface {
  addShoplessProductToCart: (input: AddShoplessProductToCartInput) => void;
  addProductToCart: (input: AddProductToCartInput) => void;
  showArticle: boolean;
  visibleListFeatures: ProductAttributeInterface[];
  visibleListFeaturesCount: number;
}

interface UseCardDataInterface {
  cardData: InitialCardDataInterface;
  companyId?: any | null;
  companySlug?: string | null;
}

const useCardData = ({
  cardData,
  companyId,
  companySlug,
}: UseCardDataInterface): UseCardDataPayloadInterface => {
  const shopsCounterPostfix = noNaN(cardData.shopsCount) > 1 ? 'магазинах' : 'магазине';
  const isShopless = noNaN(cardData.shopsCount) < 1;
  const { addShoplessProductToCart, addProductToCart } = useSiteContext();
  const { getSiteConfigBoolean, getSiteConfigSingleValue } = useConfigContext();
  const showArticle = getSiteConfigBoolean('showCardArticle');

  // visible list features slice
  const visibleListFeaturesCount = React.useMemo(() => {
    return noNaN(getSiteConfigSingleValue('cardListFeaturesCount')) || 5;
  }, [getSiteConfigSingleValue]);

  const visibleListFeatures = React.useMemo(() => {
    return cardData.listFeatures.slice(0, visibleListFeaturesCount);
  }, [cardData.listFeatures, visibleListFeaturesCount]);

  // similar products
  const { similarProducts, loading } = useGetSimilarProducts({
    companyId,
    productId: cardData.product._id,
  });

  // update product counters
  useUpdateCardCounter({
    companySlug,
    shopProductIds: cardData.product.shopProductIds,
  });

  return {
    ...cardData,
    showArticle,
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
