import useCardData from 'hooks/useCardData';
import { CardLayoutInterface } from 'pages/catalogue/[rubricSlug]/product/[card]';
import * as React from 'react';

const CardHalfColumnsLayout: React.FC<CardLayoutInterface> = ({
  cardData,
  companySlug,
  companyId,
}) => {
  const {
    similarProducts,
    showFeaturesSection,
    visibleListFeatures,
    ratingFeatures,
    textFeatures,
    tagFeatures,
    iconFeatures,
    shopsCounterPostfix,
    isShopless,
    addShoplessProductToCart,
    addProductToCart,
  } = useCardData({
    cardData,
    companySlug,
    companyId,
  });

  console.log({
    similarProducts,
    showFeaturesSection,
    visibleListFeatures,
    ratingFeatures,
    textFeatures,
    tagFeatures,
    iconFeatures,
    shopsCounterPostfix,
    isShopless,
    addShoplessProductToCart,
    addProductToCart,
  });

  return (
    <div>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad at commodi cumque deserunt est
      exercitationem, impedit libero, odio pariatur quia, sed soluta voluptatibus. Asperiores
      assumenda in non nulla temporibus voluptas?
    </div>
  );
};

export default CardHalfColumnsLayout;
