import { useSiteContext } from 'context/siteContext';
import { ShopProductModel } from 'db/dbModels';
import * as React from 'react';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@reach/disclosure';
import Button from '../../components/Buttons/Button';
import classes from './CartShopsList.module.css';
import Image from 'next/image';
import RatingStars from '../../components/RatingStars/RatingStars';
import LinkPhone from '../../components/Link/LinkPhone';
import ProductShopPrices from '../../components/Product/ProductShopPrices/ProductShopPrices';

interface CartShopInterface {
  shopProduct: ShopProductModel;
  cartProductId: string;
}

const CartShop: React.FC<CartShopInterface> = ({ shopProduct, cartProductId }) => {
  const { addShopToCartProduct } = useSiteContext();
  const { shop, formattedOldPrice, formattedPrice, discountedPercent, available } = shopProduct;
  if (!shop) {
    return null;
  }

  const {
    assets,
    name,
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
            formattedPrice={`${formattedPrice}`}
            discountedPercent={discountedPercent}
            formattedOldPrice={formattedOldPrice}
          />
          <div className={classes.available}>В наличии {` ${available} `}шт.</div>

          <div className={classes.productsCount}>Всего товаров: {productsCount}</div>

          <div className={classes.moreLink}>
            <a href='#'>Узнать больше</a>
          </div>

          <Button
            testId={`cart-shops-${slug}-add-to-cart`}
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
  shopProducts: ShopProductModel[];
}

const CartShopsList: React.FC<CartShopsInterface> = ({ cartProductId, shopProducts }) => {
  const [isShopsOpen, setIsShopsOpen] = React.useState<boolean>(false);

  const visibleShopsLimit = 4;
  const visibleShops = shopProducts.slice(0, visibleShopsLimit);
  const hiddenShops = shopProducts.slice(visibleShopsLimit);

  return (
    <div data-cy={`cart-shops-list`}>
      {visibleShops.map((shopProduct) => {
        return (
          <CartShop
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
              {hiddenShops.map((shopProduct) => {
                return (
                  <CartShop
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
