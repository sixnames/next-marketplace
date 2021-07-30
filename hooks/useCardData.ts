import { useConfigContext } from 'context/configContext';
import { useSiteContext } from 'context/siteContext';
import { AssetModel } from 'db/dbModels';
import { ProductConnectionInterface, ProductInterface } from 'db/uiInterfaces';
import { AddProductToCartInput, AddShoplessProductToCartInput } from 'generated/apolloComponents';
import useCardFeatures, { UseCardFeaturesPayloadInterface } from 'hooks/useCardFeatures';
import useGetSimilarProducts, {
  UseGetSimilarProductsPayloadInterface,
} from 'hooks/useGetSimilarProducts';
import useUpdateCardCounter from 'hooks/useUpdateCardCounter';
import { noNaN } from 'lib/numbers';
import * as React from 'react';

interface UseCardDataPayloadInterface
  extends UseCardFeaturesPayloadInterface,
    UseGetSimilarProductsPayloadInterface {
  isShopless: boolean;
  shopsCounterPostfix: string;
  addShoplessProductToCart: (input: AddShoplessProductToCartInput) => void;
  addProductToCart: (input: AddProductToCartInput) => void;
  showArticle: boolean;
  isSingleImage: boolean;
  assets: AssetModel[];
  connections: ProductConnectionInterface[];
}

interface UseCardDataInterface {
  cardData: ProductInterface;
  companyId?: any | null;
  companySlug?: string | null;
}

const minAssetsListCount = 2;

const useCardData = ({
  cardData,
  companyId,
  companySlug,
}: UseCardDataInterface): UseCardDataPayloadInterface => {
  const shopsCounterPostfix = noNaN(cardData.shopsCount) > 1 ? 'магазинах' : 'магазине';
  const isShopless = noNaN(cardData.shopsCount) < 1;
  const { addShoplessProductToCart, addProductToCart } = useSiteContext();
  const { getSiteConfigBoolean } = useConfigContext();
  const showArticle = getSiteConfigBoolean('showCardArticle');

  const { similarProducts, loading } = useGetSimilarProducts({
    companyId,
    productId: cardData._id,
  });

  const {
    showFeaturesSection,
    visibleListFeatures,
    ratingFeatures,
    textFeatures,
    tagFeatures,
    iconFeatures,
    listFeatures,
    visibleListFeaturesCount,
  } = useCardFeatures(cardData);

  // update product counters
  useUpdateCardCounter({
    companySlug,
    shopProductIds: cardData.shopProductIds,
  });

  const assets = React.useMemo<AssetModel[]>(() => {
    return cardData.assets ? cardData.assets.assets : [];
  }, [cardData.assets]);

  const connections = React.useMemo<ProductConnectionInterface[]>(() => {
    return cardData.connections || [];
  }, [cardData.connections]);

  const isSingleImage = React.useMemo(() => {
    return assets.length < minAssetsListCount;
  }, [assets]);

  return {
    assets,
    isSingleImage,
    showArticle,
    shopsCounterPostfix,
    isShopless,
    addShoplessProductToCart,
    addProductToCart,
    listFeatures,
    visibleListFeaturesCount,
    showFeaturesSection,
    visibleListFeatures,
    ratingFeatures,
    textFeatures,
    tagFeatures,
    iconFeatures,
    loading,
    similarProducts,
    connections,
  };
};

export default useCardData;
