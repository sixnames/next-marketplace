import { MapModalInterface } from 'components/Modal/MapModal';
import WpImage from 'components/WpImage';
import { MAP_MODAL } from 'config/modalVariants';
import { useAppContext } from 'context/appContext';
import { useSiteContext } from 'context/siteContext';
import { ShopProductInterface } from 'db/uiInterfaces';
import LayoutCard from 'layout/LayoutCard';
import * as React from 'react';
import Button from 'components/Button';
import RatingStars from 'components/RatingStars';
import LinkPhone from 'components/Link/LinkPhone';
import ProductShopPrices from 'components/ProductShopPrices';

interface CartShopInterface {
  shopProduct: ShopProductInterface;
  cartProductId: string;
  testId: string | number;
}

const CartShop: React.FC<CartShopInterface> = ({ shopProduct, testId, cartProductId }) => {
  const { showModal } = useAppContext();
  const { addShopToCartProduct } = useSiteContext();
  const { shop, oldPrice, price, discountedPercent, available } = shopProduct;
  if (!shop) {
    return null;
  }

  const {
    mainImage,
    name,
    address,
    contacts: { formattedPhones },
    logo,
    license,
  } = shop;

  return (
    <LayoutCard className='overflow-hidden gap-4 md:grid md:grid-cols-12'>
      <div className='relative h-[120px] w-full md:col-span-4 lg:col-span-3 md:h-full'>
        <WpImage
          url={mainImage}
          alt={`${name}`}
          title={`${name}`}
          width={120}
          className='absolute inset-0 w-full h-full object-cover'
        />
      </div>

      <div className='grid gap-4 px-4 py-6 md:col-span-8 lg:col-span-9 lg:grid-cols-5'>
        <div className='lg:col-span-3'>
          <div className='text-xl font-medium mb-2'>{name}</div>
          <div className='mb-3'>
            <RatingStars rating={4.5} showRatingNumber={false} smallStars={true} className='' />
          </div>

          <div
            className='cursor-pointer hover:text-theme'
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

        <div className='lg:col-span-2'>
          <div className='mb-4'>
            <ProductShopPrices
              className=''
              price={price}
              discountedPercent={discountedPercent}
              oldPrice={oldPrice}
            />
            <div className=''>В наличии {` ${available} `}шт.</div>

            <div className='mt-4'>
              <a href='#'>Узнать больше</a>
            </div>
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
    </LayoutCard>
  );
};

interface CartShopsInterface {
  cartProductId: string;
  shopProducts: ShopProductInterface[];
}

const CartShopsList: React.FC<CartShopsInterface> = ({ cartProductId, shopProducts }) => {
  return (
    <div className='grid gap-4' data-cy={`cart-shops-list`}>
      {shopProducts.map((shopProduct, index) => {
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
  );
};

export default CartShopsList;
