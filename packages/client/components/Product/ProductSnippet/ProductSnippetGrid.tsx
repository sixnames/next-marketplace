import React from 'react';
import classes from './ProductSnippetGrid.module.css';
import Image from '../../Image/Image';
import Link from '../../Link/Link';
import { ProductSnippetFragment } from '../../../generated/apolloComponents';
import ProductMarker from '../ProductMarker/ProductMarker';
import RatingStars from '../../RatingStars/RatingStars';
import { useSiteContext } from '../../../context/siteContext';
import ControlButton from '../../Buttons/ControlButton';
import ProductSnippetPrice from '../ProductSnippetPrice/ProductSnippetPrice';

interface ProductSnippetGridInterface {
  product: ProductSnippetFragment;
  testId?: string;
}

const ProductSnippetGrid: React.FC<ProductSnippetGridInterface> = ({ product, testId }) => {
  const { addShoplessProductToCart } = useSiteContext();
  const { nameString, mainImage, slug, cardPrices, id } = product;
  const imageWidth = 50;

  return (
    <div className={classes.frame} data-cy={testId}>
      <div className={`${classes.image} ${classes.leftColumn}`}>
        <Image url={mainImage} alt={nameString} title={nameString} width={imageWidth} />
      </div>
      <div className={classes.content}>
        <div className={classes.contentTop}>
          <div className={classes.name}>{nameString}</div>
          <div className={classes.attributes}>Новая Зеландия, белое, полусухое</div>
        </div>
        <ProductSnippetPrice value={cardPrices.min} />
      </div>

      <div className={`${classes.rating} ${classes.leftColumn}`}>
        <RatingStars size={'small'} rating={4.9} />
      </div>

      <div className={classes.bottomRight}>
        <div>
          <div className={classes.outerRating}>vivino 4,2</div>
        </div>

        <div className={classes.btns}>
          <ControlButton icon={'compare'} />
          <ControlButton icon={'heart'} />
          <ControlButton
            testId={`catalogue-item-${slug}-add-to-cart`}
            onClick={() =>
              addShoplessProductToCart({
                amount: 1,
                productId: id,
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
        href={{
          pathname: `/product/[card]`,
        }}
        as={{
          pathname: `/product/${slug}`,
        }}
        className={classes.link}
      >
        {nameString}
      </Link>
    </div>
  );
};

export default ProductSnippetGrid;
