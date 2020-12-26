import React, { useEffect, useState } from 'react';
import {
  GetProductShopsInput,
  ShopProductSnippetFragment,
  SortDirectionEnum,
  useGetCatalogueCardShopsQuery,
} from '../../generated/apolloComponents';
import { SORT_ASC } from '@yagu/shared';
import RequestError from '../../components/RequestError/RequestError';
import Spinner from '../../components/Spinner/Spinner';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@reach/disclosure';
import Button from '../../components/Buttons/Button';
import classes from './CartShopsList.module.css';
import { useSiteContext } from '../../context/siteContext';
import Image from '../../components/Image/Image';
import RatingStars from '../../components/RatingStars/RatingStars';
import LinkPhone from '../../components/Link/LinkPhone';
import ProductShopPrices from '../../components/Product/ProductShopPrices/ProductShopPrices';

interface CartShopInterface {
  shopProduct: ShopProductSnippetFragment;
  cartProductId: string;
}

const CartShop: React.FC<CartShopInterface> = ({ shopProduct, cartProductId }) => {
  const { addShopToCartProduct } = useSiteContext();
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

        <div className={`${classes.column}`}>
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

          <Button
            testId={`cart-shops-${slug}-add-to-cart`}
            onClick={() => {
              addShopToCartProduct({
                cartProductId,
                shopProductId: shopProduct.id,
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
  productId: string;
  cartProductId: string;
}

const CartShopsList: React.FC<CartShopsInterface> = ({ productId, cartProductId }) => {
  const [isShopsOpen, setIsShopsOpen] = useState<boolean>(false);
  const [shops, setShops] = useState<ShopProductSnippetFragment[] | null>(null);
  const [input] = useState<GetProductShopsInput>(() => ({
    productId,
    sortBy: 'price',
    sortDir: SORT_ASC as SortDirectionEnum,
  }));

  const { data, loading, error } = useGetCatalogueCardShopsQuery({
    variables: {
      input,
    },
  });

  useEffect(() => {
    if (data && !error && !loading) {
      setShops(data.getProductShops);
    }
  }, [data, loading, error]);

  if (error) {
    return <RequestError message={'Ошибка загрузки магазинов'} />;
  }

  if (!shops) {
    return <Spinner isNested />;
  }

  const visibleShopsLimit = 4;
  const visibleShops = shops.slice(0, visibleShopsLimit);
  const hiddenShops = shops.slice(visibleShopsLimit);

  return (
    <div data-cy={`cart-shops-list`}>
      {visibleShops.map((shop) => {
        return <CartShop key={shop.id} shopProduct={shop} cartProductId={cartProductId} />;
      })}

      {hiddenShops.length > 0 ? (
        <Disclosure onChange={() => setIsShopsOpen((prevState) => !prevState)}>
          <DisclosurePanel>
            <div>
              {hiddenShops.map((shop) => {
                return <CartShop key={shop.id} shopProduct={shop} cartProductId={cartProductId} />;
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
