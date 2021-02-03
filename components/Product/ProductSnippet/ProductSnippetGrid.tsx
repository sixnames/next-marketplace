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
  const { addShoplessProductToCart } = useSiteContext();
  const { name, mainImage, slug, cardPrices, _id, snippetFeatures } = product;
  const additionalLinkSlug = additionalSlug ? additionalSlug : '';

  const { listFeaturesString, ratingFeaturesValues } = snippetFeatures;
  const firstRatingFeature = ratingFeaturesValues[0];

  const sizeClass = classes[size];

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
        <ProductSnippetPrice value={cardPrices.min} />
      </div>

      <div className={`${classes.rating} ${classes.leftColumn}`}>
        <RatingStars size={'small'} rating={4.9} />
      </div>

      <div className={classes.bottomRight}>
        <div className={classes.outerRatingList}>
          {firstRatingFeature ? (
            <div key={firstRatingFeature} className={classes.outerRating}>
              {firstRatingFeature}
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
        href={{
          pathname: `/product${additionalLinkSlug}/${slug}`,
        }}
      >
        {name}
      </Link>
    </LayoutCard>
  );
};

export default ProductSnippetGrid;