import Breadcrumbs from 'components/Breadcrumbs';
import Inner from 'components/Inner';
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
    <article className='pb-20 pt-8 lg:pt-0' data-cy={`card`}>
      <Breadcrumbs currentPageName={cardData.originalName} config={cardData.cardBreadcrumbs} />

      <div className='mb-28 relative'>
        <Inner lowBottom lowTop>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem deserunt dicta facere iste
          nam officiis quo soluta ullam vero? Aliquid consequatur doloribus earum eum iure,
          molestiae sapiente unde vitae? Nam.
        </Inner>
      </div>
    </article>
  );
};

export default CardHalfColumnsLayout;
