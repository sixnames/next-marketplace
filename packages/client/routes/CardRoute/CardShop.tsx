import React, { useState } from 'react';
import classes from './CardShop.module.css';
import { ProductCardShopFragment } from '../../generated/apolloComponents';
import Image from '../../components/Image/Image';
import SpinnerInput from '../../components/FormElements/SpinnerInput/SpinnerInput';
import { noNaN } from '@yagu/shared';
import Button from '../../components/Buttons/Button';
import RatingStars from '../../components/RatingStars/RatingStars';
import LinkPhone from '../../components/Link/LinkPhone';
import Currency from '../../components/Currency/Currency';
import Percent from '../../components/Percent/Percent';
import { useAppContext } from '../../context/appContext';
import Icon from '../../components/Icon/Icon';

interface CardShopInterface {
  shop: ProductCardShopFragment;
}

const CardShop: React.FC<CardShopInterface> = ({ shop }) => {
  const { isMobile } = useAppContext();
  const [amount, setAmount] = useState<number>(1);
  const { node, formattedOldPrice, formattedPrice, discountedPercent, available } = shop;
  const {
    assets,
    nameString,
    productsCount,
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

        <div className={classes.mobileSchedule}>
          <div className={classes.schedule}>
            Пн - Вс: <span>10.00 - 22.00</span>
          </div>
        </div>
      </div>
      <div className={classes.content}>
        <div className={classes.column}>
          <div className={classes.name}>{nameString}</div>
          <div className={classes.meta}>
            <RatingStars
              rating={4.5}
              showRatingNumber={false}
              smallStars={true}
              className={classes.innerRating}
            />

            <div className={classes.desktopSchedule}>
              <div className={classes.schedule}>
                Пн - Вс: <span>10.00 - 22.00</span>
              </div>
            </div>
          </div>

          <div className={classes.contacts}>
            <div className={classes.address}>{formattedAddress}</div>
            {formattedPhones.map((phone, index) => {
              return <LinkPhone key={index} value={phone} />;
            })}
          </div>
        </div>

        <div className={`${classes.orderColumn}`}>
          <div className={classes.column}>
            <div className={classes.prices}>
              <div
                className={`${classes.price} ${discountedPercent ? classes.discountedPrice : ''}`}
              >
                <Currency className={classes.priceValue} value={formattedPrice} />
              </div>
              {formattedOldPrice ? (
                <div className={classes.oldPrice}>
                  <Currency className={classes.oldPriceValue} value={formattedOldPrice} />
                </div>
              ) : null}
              {discountedPercent ? (
                <div className={classes.discount}>
                  <Percent isNegative value={discountedPercent} />
                </div>
              ) : null}
            </div>

            <div className={classes.available}>В наличии {` ${available} `}шт.</div>

            <div className={classes.productsCount}>Всего товаров: {productsCount}</div>

            <div className={classes.moreLink}>
              <a href='#'>Узнать больше</a>
            </div>
          </div>

          {isMobile ? (
            <Button className={classes.mobileButton}>
              <Icon name={'cart'} />
            </Button>
          ) : (
            <div className={`${classes.column} ${classes.columnLast}`}>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default CardShop;
