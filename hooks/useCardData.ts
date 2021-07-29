import { ProductInterface } from 'db/uiInterfaces';
import useCardFeatures, { UseCardFeaturesPayloadInterface } from 'hooks/useCardFeatures';
import useGetSimilarProducts, {
  UseGetSimilarProductsPayloadInterface,
} from 'hooks/useGetSimilarProducts';
import useUpdateCardCounter from 'hooks/useUpdateCardCounter';

interface UseCardDataPayloadInterface
  extends UseCardFeaturesPayloadInterface,
    UseGetSimilarProductsPayloadInterface {}

interface UseCardDataInterface {
  cardData: ProductInterface;
  companyId?: any | null;
  companySlug?: string | null;
}

const useCardData = ({
  cardData,
  companyId,
  companySlug,
}: UseCardDataInterface): UseCardDataPayloadInterface => {
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

  return {
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
  };
};

export default useCardData;
