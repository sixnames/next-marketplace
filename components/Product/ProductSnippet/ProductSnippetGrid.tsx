import useSessionCity from 'hooks/useSessionCity';
import * as React from 'react';
import classes from './ProductSnippetGrid.module.css';
import Image from 'next/image';
import Link from '../../Link/Link';
import { ProductSnippetFragment } from 'generated/apolloComponents';
import ProductMarker from '../ProductMarker/ProductMarker';
import RatingStars from '../../RatingStars/RatingStars';
import { useSiteContext } from 'context/siteContext';
import ControlButton from '../../Buttons/ControlButton';
import ProductSnippetPrice from '../ProductSnippetPrice/ProductSnippetPrice';
import LayoutCard from '../../../layout/LayoutCard/LayoutCard';

interface ProductSnippetGridInterface {
  product: ProductSnippetFragment;
  testId?: string;
  additionalSlug?: string;
  size?: 'small' | 'normal';
}

const ProductSnippetGrid: React.FC<ProductSnippetGridInterface> = ({
  product,
  testId,
  additionalSlug,
  size = 'normal',
}) => {
  const city = useSessionCity();
  const { addShoplessProductToCart } = useSiteContext();
  const {
    name,
    mainImage,
    slug,
    cardPrices,
    _id,
    listFeatures,
    ratingFeatures,
    shopsCount,
  } = product;
  const additionalLinkSlug = additionalSlug ? additionalSlug : '';
  const isShopless = shopsCount < 1;

  const firstRatingFeature = ratingFeatures[0];

  const sizeClass = classes[size];
  const listFeaturesString = listFeatures
    .map(({ readableValue }) => {
      return readableValue;
    })
    .join(', ');

  return (
    <LayoutCard className={`${classes.snippetCard} ${sizeClass}`} testId={testId}>
      <div className={`${classes.image} ${classes.leftColumn}`}>
        <div className={classes.imageHolder}>
          <Image
            src={mainImage}
            layout={'fill'}
            objectFit={'contain'}
            objectPosition={'center bottom'}
            alt={name}
            title={name}
          />
        </div>
      </div>
      <div className={classes.content}>
        <div className={classes.contentTop}>
          <div className={classes.name}>{name}</div>
          <div className={classes.attributes}>{listFeaturesString}</div>
        </div>
        <ProductSnippetPrice isShopless={isShopless} value={cardPrices.min} />
      </div>

      <div className={`${classes.rating} ${classes.leftColumn}`}>
        <RatingStars size={'small'} rating={4.9} />
      </div>

      <div className={classes.bottomRight}>
        <div className={classes.outerRatingList}>
          {firstRatingFeature ? (
            <div key={firstRatingFeature.attributeId} className={classes.outerRating}>
              {`${firstRatingFeature.attributeName} ${firstRatingFeature.readableValue}`}
            </div>
          ) : null}
        </div>

        <div className={classes.btns}>
          <ControlButton icon={'compare'} />
          <ControlButton icon={'heart'} />
          <ControlButton
            testId={`catalogue-item-${_id}-add-to-cart`}
            onClick={() =>
              addShoplessProductToCart({
                amount: 1,
                productId: _id,
              })
            }
            icon={'cart'}
            theme={'accent'}
            roundedTopLeft
          />
        </div>
      </div>

      <ProductMarker>Выбор покупателей</ProductMarker>

      <Link
        // style={{ display: 'none' }}
        className={classes.link}
        href={`/${city}/product${additionalLinkSlug}/${slug}`}
      >
        {name}
      </Link>
    </LayoutCard>
  );
};

export default ProductSnippetGrid;
