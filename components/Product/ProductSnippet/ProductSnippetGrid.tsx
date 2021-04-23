import { useSiteContext } from 'context/siteContext';
import { ProductInterface } from 'db/uiInterfaces';
import * as React from 'react';
import classes from './ProductSnippetGrid.module.css';
import Image from 'next/image';
import Link from '../../Link/Link';
import RatingStars from '../../RatingStars/RatingStars';
import ControlButton from '../../Buttons/ControlButton';
import ProductSnippetPrice from '../ProductSnippetPrice/ProductSnippetPrice';
import LayoutCard from 'layout/LayoutCard';

interface ProductSnippetGridInterface {
  product: ProductInterface;
  testId?: string;
  additionalSlug?: string;
  size?: 'small' | 'normal';
  className?: string;
}

const ProductSnippetGrid: React.FC<ProductSnippetGridInterface> = ({
  product,
  testId,
  additionalSlug,
  size = 'normal',
  className,
}) => {
  const { addShoplessProductToCart } = useSiteContext();
  const {
    name,
    originalName,
    slug,
    cardPrices,
    _id,
    listFeatures,
    ratingFeatures,
    shopsCount,
    mainImage,
  } = product;
  const additionalLinkSlug = additionalSlug ? additionalSlug : '';
  const firstRatingFeature = ratingFeatures ? ratingFeatures[0] : null;

  const sizeClass = classes[size];
  const listFeaturesString = (listFeatures || [])
    .map(({ readableValue }) => {
      return readableValue;
    })
    .join(', ');

  return (
    <LayoutCard
      className={`${classes.snippetCard} ${sizeClass} ${className ? className : ''}`}
      testId={testId}
    >
      <div className={`${classes.image} ${classes.leftColumn}`}>
        <Image
          priority={true}
          src={mainImage}
          objectFit={'contain'}
          objectPosition={'center'}
          alt={originalName}
          title={originalName}
          width={85}
          height={190}
          quality={50}
        />
      </div>
      <div className={classes.content}>
        <div className={classes.contentTop}>
          <div className={classes.name}>{originalName}</div>
          <div className={classes.nameTranslation}>{name}</div>
          <div className={classes.attributes}>{listFeaturesString}</div>
        </div>
        <ProductSnippetPrice shopsCount={shopsCount} value={cardPrices?.min} />
      </div>

      <div className={`${classes.rating} ${classes.leftColumn}`}>
        <RatingStars size={'small'} rating={4.9} />
      </div>

      <div className={classes.bottomRight}>
        <div className={classes.outerRatingList}>
          {firstRatingFeature ? (
            <div key={`${firstRatingFeature.attributeId}`} className={classes.outerRating}>
              {`${firstRatingFeature.attribute?.name} ${firstRatingFeature.readableValue}`}
            </div>
          ) : null}
        </div>

        <div className={classes.btns}>
          <ControlButton icon={'compare'} ariaLabel={'Добавить в сравнение'} />
          <ControlButton icon={'heart'} ariaLabel={'Добавить в избранное'} />
          <ControlButton
            ariaLabel={'Добавить в корзину'}
            testId={`catalogue-item-${slug}-add-to-cart`}
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

      <Link
        // style={{ display: 'none' }}
        prefetch={false}
        className={classes.link}
        href={`/product${additionalLinkSlug}/${slug}`}
      >
        {originalName}
      </Link>
    </LayoutCard>
  );
};

export default ProductSnippetGrid;
