import React from 'react';
import classes from './ProductSnippetGrid.module.css';
import { CatalogueProductType } from '../../types';
import Image from '../Image/Image';
import Link from '../Link/Link';
import { useSiteContext } from '../../context/siteContext';
import Icon from '../Icon/Icon';

interface ProductSnippetGridInterface {
  product: CatalogueProductType;
  rubricSlug: string;
}

const ProductSnippetGrid: React.FC<ProductSnippetGridInterface> = ({ product }) => {
  const { nameString, mainImage, slug, price } = product;
  const { currency } = useSiteContext();
  const imageWidth = 50;

  return (
    <div className={classes.frame}>
      <div className={classes.image}>
        <Image url={mainImage} alt={nameString} title={nameString} width={imageWidth} />
      </div>
      <div className={classes.content}>
        <div className={classes.contentTop}>
          <div className={classes.name}>{nameString}</div>
          <div className={classes.attributes}>Новая Зеландия, белое, полусухое</div>
        </div>
        <div className={classes.price}>
          от <span className={classes.priceValue}>{price}</span>
          {` ${currency}`}
        </div>
      </div>

      <div className={classes.rating}>
        <div className={classes.ratingSmall}>
          <span>4,9</span>
          <Icon name={'star'} />
        </div>
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

      <div className={classes.marker}>Выбор покупателей</div>
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
