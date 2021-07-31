import { useConfigContext } from 'context/configContext';
import { ProductAttributeInterface, ProductInterface } from 'db/uiInterfaces';
import { noNaN } from 'lib/numbers';
import * as React from 'react';

export interface UseCardFeaturesPayloadInterface {
  listFeatures: ProductAttributeInterface[];
  iconFeatures: ProductAttributeInterface[];
  tagFeatures: ProductAttributeInterface[];
  textFeatures: ProductAttributeInterface[];
  ratingFeatures: ProductAttributeInterface[];
  visibleListFeatures: ProductAttributeInterface[];
  visibleListFeaturesCount: number;
  showFeaturesSection: boolean;
}

const useCardFeatures = (cardData: ProductInterface): UseCardFeaturesPayloadInterface => {
  const { getSiteConfigSingleValue } = useConfigContext();

  const listFeatures = React.useMemo(() => {
    return cardData.listFeatures || [];
  }, [cardData.listFeatures]);
  const iconFeatures = React.useMemo(() => {
    return cardData.iconFeatures || [];
  }, [cardData.iconFeatures]);

  const tagFeatures = React.useMemo(() => {
    return cardData.tagFeatures || [];
  }, [cardData.tagFeatures]);

  const textFeatures = React.useMemo(() => {
    return cardData.textFeatures || [];
  }, [cardData.textFeatures]);

  const ratingFeatures = React.useMemo(() => {
    return cardData.ratingFeatures || [];
  }, [cardData.ratingFeatures]);

  // visible list features slice
  const visibleListFeaturesCount = React.useMemo(() => {
    return noNaN(getSiteConfigSingleValue('cardListFeaturesCount')) || 5;
  }, [getSiteConfigSingleValue]);

  const visibleListFeatures = React.useMemo(() => {
    return listFeatures.slice(0, visibleListFeaturesCount);
  }, [listFeatures, visibleListFeaturesCount]);

  const showFeaturesSection = React.useMemo(() => {
    return (
      iconFeatures.length > 0 ||
      tagFeatures.length > 0 ||
      textFeatures.length > 0 ||
      ratingFeatures.length > 0
    );
  }, [iconFeatures.length, ratingFeatures.length, tagFeatures.length, textFeatures.length]);

  return {
    listFeatures,
    iconFeatures,
    tagFeatures,
    textFeatures,
    ratingFeatures,
    showFeaturesSection,
    visibleListFeatures,
    visibleListFeaturesCount,
  };
};

export default useCardFeatures;
