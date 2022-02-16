import ArrowTrigger from 'components/ArrowTrigger';
import WpButton from 'components/button/WpButton';
import { useAppContext } from 'components/context/appContext';
import { useConfigContext } from 'components/context/configContext';
import { useSiteContext } from 'components/context/siteContext';
import SpinnerInput from 'components/FormElements/SpinnerInput/SpinnerInput';
import LayoutCard from 'components/layout/LayoutCard';
import LinkPhone from 'components/Link/LinkPhone';
import { MapModalInterface } from 'components/Modal/MapModal';
import ProductShopPrices from 'components/ProductShopPrices';
import RatingStars from 'components/RatingStars';
import ShopsMap from 'components/ShopsMap';
import WpImage from 'components/WpImage';
import { ShopInterface } from 'db/uiInterfaces';
import { MAP_MODAL } from 'lib/config/modalVariants';
import { noNaN } from 'lib/numbers';
import * as React from 'react';

interface CardShopInterface {
  shop: ShopInterface;
}

const CardShop: React.FC<CardShopInterface> = ({ shop }) => {
  const { configs } = useConfigContext();
  const { addCartProduct, getShopProductInCartCount } = useSiteContext();
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

  const { oldPrice, price, discountedPercent, available, productId, allowDelivery } =
    cardShopProduct;
  const inCartCount = getShopProductInCartCount(`${cardShopProduct._id}`, allowDelivery);

  const disabled = amount + noNaN(inCartCount) > available;

  return (
    <noindex>
      <LayoutCard className='gap-4 overflow-hidden md:grid md:grid-cols-12'>
        <div className='relative h-[120px] w-full md:col-span-4 md:h-full lg:col-span-3'>
          <WpImage
            url={mainImage}
            alt={name}
            title={name}
            width={240}
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
                        icon: logo,
                        name,
                        address,
                      },
                    ],
                  },
                });
              }}
            >
              {address.readableAddress}
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
              {configs.showShopProductAvailability ? (
                <React.Fragment>
                  {disabled ? (
                    <div className='col-span-5 text-theme'>Нет в наличии</div>
                  ) : (
                    <div className=''>В наличии {` ${available} `}шт.</div>
                  )}
                </React.Fragment>
              ) : null}
            </div>

            <div className='grid max-w-[340px] grid-cols-6 gap-3'>
              {disabled ? null : (
                <React.Fragment>
                  <div className='col-span-3'>
                    <SpinnerInput
                      size={'small'}
                      plusTestId={`card-shops-${slug}-plus`}
                      minusTestId={`card-shops-${slug}-minus`}
                      testId={`card-shops-${slug}-input`}
                      onChange={(e) => {
                        setAmount(noNaN(e.target.value));
                      }}
                      min={1}
                      max={available}
                      name={'amount'}
                      value={amount}
                    />
                  </div>
                  <div className='col-span-3'>
                    <WpButton
                      short
                      size={'small'}
                      className='w-full'
                      disabled={disabled}
                      testId={`card-shops-${slug}-add-to-cart`}
                      onClick={() => {
                        addCartProduct({
                          amount,
                          productId: `${productId}`,
                          shopProductId: `${cardShopProduct._id}`,
                        });
                      }}
                    >
                      {noNaN(inCartCount) > 0 ? `В корзине ${inCartCount} ед.` : 'В корзину'}
                    </WpButton>
                  </div>
                </React.Fragment>
              )}
            </div>
          </div>
        </div>
      </LayoutCard>
    </noindex>
  );
};

interface CardShopsListInterface {
  cardShops?: ShopInterface[] | null;
}

const CardShopsList: React.FC<CardShopsListInterface> = ({ cardShops }) => {
  const [isMap, setIsMap] = React.useState<boolean>(false);
  if (!cardShops) {
    return null;
  }

  return (
    <section id={`card-shops`} className='mb-28'>
      <div className='mb-6 flex flex-col items-baseline gap-4 sm:flex-row sm:justify-between'>
        <h2 className='text-2xl font-medium'>Наличие в магазинах</h2>

        <ArrowTrigger
          arrowPosition={isMap ? 'left' : 'right'}
          name={isMap ? 'К списку магазинов' : 'Показать на карте'}
          onClick={() => setIsMap((prevState) => !prevState)}
        />
      </div>

      <div data-cy={`card-shops`}>
        {isMap ? (
          <div data-cy={`card-shops-map`}>
            <ShopsMap shops={cardShops} />
          </div>
        ) : (
          <div className='grid gap-8' data-cy={`card-shops-list`}>
            {cardShops.map((shop) => {
              return <CardShop key={`${shop._id}`} shop={shop} />;
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default CardShopsList;
