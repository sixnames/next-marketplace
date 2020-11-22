import React from 'react';
import classes from './ProductSnippetGrid.module.css';
import Image from '../../Image/Image';
import Link from '../../Link/Link';
import Icon from '../../Icon/Icon';
import { ProductSnippetFragment } from '../../../generated/apolloComponents';
import ProductMarker from '../ProductMarker/ProductMarker';
import RatingStars from '../../RatingStars/RatingStars';
import Currency from '../../Currency/Currency';

interface ProductSnippetGridInterface {
  product: ProductSnippetFragment;
  testId?: string;
}

const ProductSnippetGrid: React.FC<ProductSnippetGridInterface> = ({ product, testId }) => {
  const { nameString, mainImage, slug, cardPrices } = product;
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
        <div className={classes.price}>
          от <Currency className={classes.priceValue} value={cardPrices.min} />
        </div>
      </div>

      <div className={`${classes.rating} ${classes.leftColumn}`}>
        <RatingStars size={'small'} rating={4.9} />
      </div>

      <div className={classes.bottomRight}>
        <div>
          <div className={classes.outerRating}>vivino 4,2</div>
        </div>

        <div className={classes.btns}>
          <button className={`${classes.btnsItem}`}>
            <Icon name={'compare'} />
          </button>
          <button className={`${classes.btnsItem}`}>
            <Icon name={'heart'} />
          </button>
          <button className={`${classes.btnsItem} ${classes.btnsItemCart}`}>
            <Icon name={'cart'} />
          </button>
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
