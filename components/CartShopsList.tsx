import * as React from 'react';
import { ShopProductInterface } from '../db/uiInterfaces';
import { useShopMarker } from '../hooks/useShopMarker';
import { MAP_MODAL } from '../lib/config/modalVariants';
import WpButton from './button/WpButton';
import { useAppContext } from './context/appContext';
import { useSiteContext } from './context/siteContext';
import LayoutCard from './layout/LayoutCard';
import LinkPhone from './Link/LinkPhone';
import { MapModalInterface } from './Modal/MapModal';
import ProductShopPrices from './ProductShopPrices';
import RatingStars from './RatingStars';
import WpImage from './WpImage';

interface CartShopInterface {
  shopProduct: ShopProductInterface;
  cartProductId: string;
  testId: string | number;
}

const CartShop: React.FC<CartShopInterface> = ({ shopProduct, testId, cartProductId }) => {
  const { showModal } = useAppContext();
  const { updateCartProduct } = useSiteContext();
  const marker = useShopMarker(shopProduct.shop);
  const { shop, oldPrice, price, discountedPercent, available } = shopProduct;
  if (!shop) {
    return null;
  }

  const {
    mainImage,
    name,
    address,
    contacts: { formattedPhones },
    license,
  } = shop;

  return (
    <LayoutCard className='gap-4 overflow-hidden md:grid md:grid-cols-12'>
      <div className='relative h-[120px] w-full md:col-span-4 md:h-full lg:col-span-3'>
        <WpImage
          url={mainImage}
          alt={`${name}`}
          title={`${name}`}
          width={120}
          className='absolute inset-0 h-full w-full object-cover'
        />
      </div>

      <div className='grid gap-4 px-4 py-6 md:col-span-8 lg:col-span-9 lg:grid-cols-5'>
        <div className='lg:col-span-3'>
          <div className='mb-2 text-xl font-medium'>{name}</div>
          <div className='mb-3'>
            <RatingStars rating={4.5} showRatingNumber={false} smallStars={true} className='' />
          </div>

          <div
            className='cursor-pointer transition-all hover:text-theme'
            onClick={() => {
              showModal<MapModalInterface>({
                variant: MAP_MODAL,
                props: {
                  title: name,
                  testId: `shop-map-modal`,
                  markers: [
                    {
                      _id: shop._id,
                      icon: marker,
                      name: shop.name,
                      address: shop.address,
                    },
                  ],
                },
              });
            }}
          >
            {address.readableAddress}
            <div className='text-theme'>???????????????? ???? ??????????</div>
          </div>

          {(formattedPhones || []).map((phone, index) => {
            return <LinkPhone key={index} value={phone} />;
          })}

          {license ? (
            <div className='mt-3 text-sm text-secondary-text'>
              ????????????????:
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
            <div className=''>?? ?????????????? {` ${available} `}????.</div>

            <div className='mt-4'>
              <a href='#'>???????????? ????????????</a>
            </div>
          </div>

          <WpButton
            testId={`cart-shops-${testId}-add-to-cart`}
            onClick={() => {
              updateCartProduct({
                cartProductId: `${cartProductId}`,
                shopProductId: `${shopProduct._id}`,
              });
            }}
          >
            ??????????????
          </WpButton>
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
