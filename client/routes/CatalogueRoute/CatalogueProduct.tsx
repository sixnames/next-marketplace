import React from 'react';
import classes from './CatalogueProduct.module.css';
import Link from 'next/link';
import Image from '../../components/Image/Image';

interface CatalogueProductInterface {
  product: any;
  rubricSlug: string;
}

const CatalogueProduct: React.FC<CatalogueProductInterface> = ({ product, rubricSlug }) => {
  const { slug, name, itemId, mainImage, price, id } = product;
  const imageWidth = 218;

  return (
    <div className={classes.Frame} data-id={id}>
      <div className={classes.Top}>
        <div className={classes.Image}>
          <Image url={mainImage} alt={name} title={name} width={imageWidth} />
        </div>

        <div className={classes.Name}>{name}</div>

        <div className={classes.Price}>{price}</div>

        <div className={classes.Art}>Артикул: {itemId}</div>
      </div>

      <Link
        href={{
          pathname: `[catalogue]/[card]`,
          query: { id: `${id}` },
        }}
        as={{
          pathname: `${rubricSlug}/${slug}`,
          query: { id: `${id}` },
        }}
      >
        <a className={classes.Link}>{name}</a>
      </Link>
    </div>
  );
};

export default CatalogueProduct;
