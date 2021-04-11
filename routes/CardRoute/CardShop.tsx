import { useSiteContext } from 'context/siteContext';
import { ShopProductModel } from 'db/dbModels';
import * as React from 'react';
import classes from './CardShop.module.css';
import Image from 'next/image';
import SpinnerInput from '../../components/FormElements/SpinnerInput/SpinnerInput';
import Button from '../../components/Buttons/Button';
import RatingStars from '../../components/RatingStars/RatingStars';
import LinkPhone from '../../components/Link/LinkPhone';
import { useAppContext } from 'context/appContext';
import Icon from '../../components/Icon/Icon';
import ProductShopPrices from '../../components/Product/ProductShopPrices/ProductShopPrices';
import LayoutCard from '../../layout/LayoutCard/LayoutCard';
import { noNaN } from 'lib/numbers';

interface CardShopInterface {
  shopProduct: ShopProductModel;
}

const CardShop: React.FC<CardShopInterface> = ({ shopProduct }) => {
  const { isMobile } = useAppContext();
  const { addProductToCart } = useSiteContext();
  const [amount, setAmount] = React.useState<number>(1);
  const {
    shop,
    formattedOldPrice,
    formattedPrice,
    discountedPercent,
    available,
    inCartCount,
  } = shopProduct;

  if (!shop) {
    return null;
  }

  const {
    assets,
    name,
    slug,
    address: { formattedAddress },
    contacts: { formattedPhones },
  } = shop;
  const mainAsset = assets[0];
  const mainImage = mainAsset ? mainAsset.url : `${process.env.OBJECT_STORAGE_IMAGE_FALLBACK}`;

  const disabled = amount + noNaN(inCartCount) > available;

  return (
    <LayoutCard className={`${classes.cardShop}`}>
      <div className={classes.imageHolder}>
        <div className={classes.image}>
          <Image objectFit={'cover'} layout={'fill'} src={mainImage} alt={name} title={name} />
        </div>

        <div className={classes.mobileSchedule}>
          <div className={classes.schedule}>
            Пн - Вс: <span>10.00 - 22.00</span>
          </div>
        </div>
      </div>
      <div className={classes.content}>
        <div className={classes.column}>
          <div className={classes.name}>{name}</div>
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
            {(formattedPhones || []).map((phone, index) => {
              return <LinkPhone key={index} value={phone} />;
            })}
          </div>
        </div>

        <div className={`${classes.orderColumn}`}>
          <div className={classes.column}>
            <ProductShopPrices
              className={classes.prices}
              formattedPrice={`${formattedPrice}`}
              discountedPercent={discountedPercent}
              formattedOldPrice={formattedOldPrice}
            />
            <div className={classes.available}>В наличии {` ${available} `}шт.</div>

            {noNaN(inCartCount) > 0 ? (
              <div className={classes.available}>В корзине {` ${inCartCount} `}шт.</div>
            ) : null}

            <div className={classes.moreLink}>
              <a href='#'>Узнать больше</a>
            </div>
          </div>

          {isMobile ? (
            <Button
              className={classes.mobileButton}
              disabled={disabled}
              onClick={() => {
                addProductToCart({
                  amount,
                  shopProductId: shopProduct._id,
                });
              }}
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
                disabled={disabled}
                testId={`card-shops-${slug}-add-to-cart`}
                onClick={() => {
                  addProductToCart({
                    amount,
                    shopProductId: shopProduct._id,
                  });
                }}
              >
                В корзину
              </Button>
            </div>
          )}
        </div>
      </div>
    </LayoutCard>
  );
};

export default CardShop;
