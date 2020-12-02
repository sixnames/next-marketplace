import React, { useState } from 'react';
import classes from './CardShop.module.css';
import { ShopProductSnippetFragment } from '../../generated/apolloComponents';
import Image from '../../components/Image/Image';
import SpinnerInput from '../../components/FormElements/SpinnerInput/SpinnerInput';
import { noNaN } from '@yagu/shared';
import Button from '../../components/Buttons/Button';
import RatingStars from '../../components/RatingStars/RatingStars';
import LinkPhone from '../../components/Link/LinkPhone';
import { useAppContext } from '../../context/appContext';
import Icon from '../../components/Icon/Icon';
import { useSiteContext } from '../../context/siteContext';
import ProductShopPrices from '../../components/Product/ProductShopPrices/ProductShopPrices';

interface CardShopInterface {
  shopProduct: ShopProductSnippetFragment;
}

const CardShop: React.FC<CardShopInterface> = ({ shopProduct }) => {
  const { isMobile } = useAppContext();
  const { addProductToCart } = useSiteContext();
  const [amount, setAmount] = useState<number>(1);
  const { shop, formattedOldPrice, formattedPrice, discountedPercent, available } = shopProduct;
  const {
    assets,
    nameString,
    productsCount,
    slug,
    address: { formattedAddress },
    contacts: { formattedPhones },
  } = shop;
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
            <ProductShopPrices
              className={classes.prices}
              formattedPrice={formattedPrice}
              discountedPercent={discountedPercent}
              formattedOldPrice={formattedOldPrice}
            />
            <div className={classes.available}>В наличии {` ${available} `}шт.</div>

            <div className={classes.productsCount}>Всего товаров: {productsCount}</div>

            <div className={classes.moreLink}>
              <a href='#'>Узнать больше</a>
            </div>
          </div>

          {isMobile ? (
            <Button
              onClick={() => {
                addProductToCart({
                  amount,
                  shopProductId: shopProduct.id,
                });
              }}
              className={classes.mobileButton}
            >
              <Icon name={'cart'} />
            </Button>
          ) : (
            <div className={`${classes.column} ${classes.columnLast}`}>
              <SpinnerInput
                plusTestId={`card-shops-${slug}-plus`}
                minusTestId={`card-shops-${slug}-minus`}
                testId={`card-shops-${slug}-input`}
                onChange={(e) => {
                  setAmount(noNaN(e.target.value));
                }}
                className={classes.input}
                min={1}
                max={available}
                name={'amount'}
                value={amount}
              />
              <Button
                testId={`card-shops-${slug}-add-to-cart`}
                onClick={() => {
                  addProductToCart({
                    amount,
                    shopProductId: shopProduct.id,
                  });
                }}
              >
                В корзину
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardShop;
