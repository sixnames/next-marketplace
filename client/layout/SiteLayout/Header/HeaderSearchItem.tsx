import React from 'react';
import classes from './HeaderSearchItem.module.css';
import Link from '../../../components/Link/Link';

interface HeaderSearchItemInterface {
  product: {
    name: string;
    itemId: number;
    images: string[];
    slug: string;
  };
}

const HeaderSearchItem: React.FC<HeaderSearchItemInterface> = ({ product }) => {
  const { name, itemId, images, slug } = product;
  return (
    <div className={classes.frame}>
      <Link href={`/${slug}`} className={classes.link}>
        {name}
      </Link>

      <div className={classes.image}>
        <img src={images[0]} alt={name} title={name} />
      </div>
      <div>
        <div className={classes.name}>{name}</div>
        <div className={classes.art}>{itemId}</div>
      </div>
    </div>
  );
};

export default HeaderSearchItem;
