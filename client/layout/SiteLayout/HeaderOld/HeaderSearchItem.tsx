import React from 'react';
import classes from './HeaderSearchItem.module.css';
import Link from '../../../components/Link/Link';
import Image from '../../../components/Image/Image';

interface HeaderSearchItemInterface {
  product: {
    name: string;
    itemId: number;
    mainImage: string;
    slug: string;
  };
}

const HeaderSearchItem: React.FC<HeaderSearchItemInterface> = ({ product }) => {
  const { name, itemId, mainImage, slug } = product;
  return (
    <div className={classes.frame}>
      <Link href={`/${slug}`} className={classes.link}>
        {name}
      </Link>

      <div className={classes.image}>
        <Image url={mainImage} alt={name} title={name} width={60} />
      </div>
      <div>
        <div className={classes.name}>{name}</div>
        <div className={classes.art}>{itemId}</div>
      </div>
    </div>
  );
};

export default HeaderSearchItem;
