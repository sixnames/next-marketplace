import { useSiteContext } from 'context/siteContext';
import { ShopProductInterface } from 'db/uiInterfaces';
import * as React from 'react';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@reach/disclosure';
import Button from 'components/Button';
import classes from './CartShopsList.module.css';
import Image from 'next/image';
import RatingStars from 'components/RatingStars';
import LinkPhone from '../../components/Link/LinkPhone';
import ProductShopPrices from 'components/Product/ProductShopPrices';

interface CartShopInterface {
  shopProduct: ShopProductInterface;
  cartProductId: string;
  testId: string | number;
}

const CartShop: React.FC<CartShopInterface> = ({ shopProduct, testId, cartProductId }) => {
  const { addShopToCartProduct } = useSiteContext();
  const { shop, formattedOldPrice, formattedPrice, discountedPercent, available } = shopProduct;
  if (!shop) {
    return null;
  }

  const {
    mainImage,
    name,
    productsCount,
    address: { formattedAddress },
    contacts: { formattedPhones },
  } = shop;

  return (
    <div className={`${classes.frame}`}>
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

        <div className={`${classes.column}`}>
          <ProductShopPrices
            className={classes.prices}
            price={`${formattedPrice}`}
            discountedPercent={discountedPercent}
            oldPrice={formattedOldPrice}
          />
          <div className={classes.available}>В наличии {` ${available} `}шт.</div>

          <div className={classes.productsCount}>Всего товаров: {productsCount}</div>

          <div className={classes.moreLink}>
            <a href='#'>Узнать больше</a>
          </div>

          <Button
            testId={`cart-shops-${testId}-add-to-cart`}
            onClick={() => {
              addShopToCartProduct({
                cartProductId,
                shopProductId: shopProduct._id,
              });
            }}
          >
            Выбрать
          </Button>
        </div>
      </div>
    </div>
  );
};

interface CartShopsInterface {
  cartProductId: string;
  shopProducts: ShopProductInterface[];
}

const CartShopsList: React.FC<CartShopsInterface> = ({ cartProductId, shopProducts }) => {
  const [isShopsOpen, setIsShopsOpen] = React.useState<boolean>(false);

  // TODO cart shops count config
  const visibleShopsLimit = 4;
  const visibleShops = shopProducts.slice(0, visibleShopsLimit);
  const hiddenShops = shopProducts.slice(visibleShopsLimit);

  return (
    <div data-cy={`cart-shops-list`}>
      {visibleShops.map((shopProduct, index) => {
        return (
          <CartShop
            testId={index}
            key={`${shopProduct._id}`}
            shopProduct={shopProduct}
            cartProductId={cartProductId}
          />
        );
      })}

      {hiddenShops.length > 0 ? (
        <Disclosure onChange={() => setIsShopsOpen((prevState) => !prevState)}>
          <DisclosurePanel>
            <div>
              {hiddenShops.map((shopProduct, index) => {
                return (
                  <CartShop
                    testId={index}
                    key={`${shopProduct._id}`}
                    shopProduct={shopProduct}
                    cartProductId={cartProductId}
                  />
                );
              })}
            </div>
          </DisclosurePanel>
          <DisclosureButton as={'div'}>
            <Button className={classes.moreShopsButton} theme={'secondary'}>
              {isShopsOpen ? 'Показать меньше магазинов' : 'Показать больше магазинов'}
            </Button>
          </DisclosureButton>
        </Disclosure>
      ) : null}
    </div>
  );
};

export default CartShopsList;
