import React, { useState } from 'react';
import classes from './CardShop.module.css';
import { ProductCardShopFragment } from '../../generated/apolloComponents';
import Image from '../../components/Image/Image';
import SpinnerInput from '../../components/FormElements/SpinnerInput/SpinnerInput';
import { noNaN } from '@yagu/shared';
import Button from '../../components/Buttons/Button';
import RatingStars from '../../components/RatingStars/RatingStars';
import LinkPhone from '../../components/Link/LinkPhone';

interface CardShopInterface {
  shop: ProductCardShopFragment;
}

const CardShop: React.FC<CardShopInterface> = ({ shop }) => {
  const [amount, setAmount] = useState<number>(1);
  const { node } = shop;
  const {
    assets,
    nameString,
    address: { formattedAddress },
    contacts: { formattedPhones },
  } = node;
  const mainImage = assets[0].url;

  return (
    <div className={`${classes.frame}`}>
      <div className={classes.imageHolder}>
        <div className={classes.image}>
          <Image url={mainImage} alt={nameString} title={nameString} width={215} />
        </div>
      </div>
      <div className={classes.column}>
        <div className={classes.name}>{nameString}</div>
        <div className={classes.meta}>
          <RatingStars
            rating={4.5}
            showRatingNumber={false}
            smallStars={true}
            className={classes.innerRating}
          />
          <div className={classes.schedule}>Пн - Вс: 10.00 - 22.00</div>
        </div>

        <div className={classes.contacts}>
          <div className={classes.address}>{formattedAddress}</div>
          {formattedPhones.map((phone, index) => {
            return <LinkPhone key={index} value={phone} />;
          })}
        </div>
      </div>
      <div className={classes.orderColumn}>
        <div className={classes.column}>lorem</div>
        <div className={classes.column}>
          <SpinnerInput
            onChange={(e) => {
              setAmount(noNaN(e.target.value));
            }}
            className={classes.input}
            min={1}
            name={'amount'}
            value={amount}
          />
          <Button>В корзину</Button>
        </div>
      </div>
    </div>
  );
};

export default CardShop;
