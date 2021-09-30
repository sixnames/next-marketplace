import { MapModalInterface } from 'components/Modal/MapModal';
import { MAP_MODAL } from 'config/modalVariants';
import { useAppContext } from 'context/appContext';
import { useSiteContext } from 'context/siteContext';
import { ShopInterface } from 'db/uiInterfaces';
import * as React from 'react';
import classes from './CardShop.module.css';
import Image from 'next/image';
import SpinnerInput from '../../components/FormElements/SpinnerInput/SpinnerInput';
import Button from 'components/Button';
import RatingStars from 'components/RatingStars';
import LinkPhone from '../../components/Link/LinkPhone';
import Icon from 'components/Icon';
import ProductShopPrices from 'components/ProductShopPrices';
import LayoutCard from 'layout/LayoutCard';
import { noNaN } from 'lib/numbers';

interface CardShopInterface {
  shop: ShopInterface;
  testId: string | number;
}

const CardShop: React.FC<CardShopInterface> = ({ shop, testId }) => {
  const { addProductToCart, getShopProductInCartCount } = useSiteContext();
  const { showModal } = useAppContext();
  const [amount, setAmount] = React.useState<number>(1);

  if (!shop) {
    return null;
  }

  const {
    name,
    slug,
    address,
    contacts: { formattedPhones },
    mainImage,
    logo,
    license,
    cardShopProduct,
  } = shop;

  if (!cardShopProduct) {
    return null;
  }

  const { oldPrice, price, discountedPercent, available, productId } = cardShopProduct;
  const inCartCount = getShopProductInCartCount(`${cardShopProduct._id}`);

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
            <div
              className={`cursor-pointer hover:text-theme ${classes.address}`}
              onClick={() => {
                showModal<MapModalInterface>({
                  variant: MAP_MODAL,
                  props: {
                    title: name,
                    testId: `shop-map-modal`,
                    markers: [
                      {
                        _id: shop._id,
                        icon: logo.url,
                        name,
                        address,
                      },
                    ],
                  },
                });
              }}
            >
              {address.formattedAddress}
            </div>
            {(formattedPhones || []).map((phone, index) => {
              return <LinkPhone key={index} value={phone} />;
            })}

            {license ? (
              <div className='mt-3 text-sm text-secondary-text'>
                Лицензия:
                {` ${license}`}
              </div>
            ) : null}
          </div>
        </div>

        <div className={`${classes.orderColumn}`}>
          <div className={classes.column}>
            <ProductShopPrices
              className={classes.prices}
              price={price}
              discountedPercent={discountedPercent}
              oldPrice={oldPrice}
            />
            <div className={classes.available}>В наличии {` ${available} `}шт.</div>

            {noNaN(inCartCount) > 0 ? (
              <div className={classes.available}>В корзине {` ${inCartCount} `}шт.</div>
            ) : null}

            <div className={classes.moreLink}>
              <a href='#'>Узнать больше</a>
            </div>
          </div>

          {/* Mobile */}
          <Button
            className={`flex lg:hidden ${classes.mobileButton}`}
            disabled={disabled}
            onClick={() => {
              addProductToCart({
                amount: 1,
                productId,
                shopProductId: cardShopProduct._id,
              });
            }}
          >
            <Icon name={'cart'} />
          </Button>

          {/* Desktop */}
          <div className={`hidden lg:block ${classes.column} ${classes.columnLast}`}>
            <SpinnerInput
              plusTestId={`card-shops-${testId}-plus`}
              minusTestId={`card-shops-${testId}-minus`}
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
              testId={`card-shops-${testId}-add-to-cart`}
              onClick={() => {
                addProductToCart({
                  amount,
                  productId,
                  shopProductId: cardShopProduct._id,
                });
              }}
            >
              В корзину
            </Button>
          </div>
        </div>
      </div>
    </LayoutCard>
  );
};

export default CardShop;
