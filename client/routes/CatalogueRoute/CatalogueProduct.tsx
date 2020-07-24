import React from 'react';
import classes from './CatalogueProduct.module.css';
import Link from 'next/link';
import Image from '../../components/Image/Image';
import { Product } from '../../generated/apolloComponents';

type CatalogueProductType = Pick<
  Product,
  'id' | 'itemId' | 'nameString' | 'price' | 'slug' | 'mainImage'
>;

interface CatalogueProductInterface {
  product: CatalogueProductType;
  rubricSlug: string;
}

const CatalogueProduct: React.FC<CatalogueProductInterface> = ({ product }) => {
  const { nameString, itemId, mainImage, price, slug } = product;
  const imageWidth = 218;

  return (
    <div className={classes.Frame} data-cy={`catalogue-product-${nameString}`}>
      <div className={classes.Top}>
        <div className={classes.Image}>
          <Image url={mainImage} alt={nameString} title={nameString} width={imageWidth} />
        </div>

        <div className={classes.Name}>{nameString}</div>

        <div className={classes.Price}>{price}</div>

        <div className={classes.Art}>Артикул: {itemId}</div>
      </div>

      <Link
        href={{
          pathname: `/product/[card]`,
        }}
        as={{
          pathname: `/product/${slug}`,
        }}
      >
        <a className={classes.Link}>{nameString}</a>
      </Link>
    </div>
  );
};

export default CatalogueProduct;
