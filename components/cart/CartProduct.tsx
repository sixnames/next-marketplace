import { useFormikContext } from 'formik';
import { get } from 'lodash';
import * as React from 'react';
import { ORDER_DELIVERY_VARIANT_COURIER } from '../../config/common';
import { useSiteContext } from '../../context/siteContext';
import { CartProductInterface, ShopProductInterface } from '../../db/uiInterfaces';
import LayoutCard from '../../layout/LayoutCard';
import ProductSnippetPrice from '../../layout/snippet/ProductSnippetPrice';
import { noNaN } from '../../lib/numbers';
import ButtonCross from '../button/ButtonCross';
import ControlButton from '../button/ControlButton';
import WpButton from '../button/WpButton';
import CartShopsList from '../CartShopsList';
import FormikSpinnerInput from '../FormElements/SpinnerInput/FormikSpinnerInput';
import WpLink from '../Link/WpLink';
import ProductShopPrices from '../ProductShopPrices';
import WpImage from '../WpImage';

interface CartProductFrameInterface {
  cartProductId: string;
  isShopsVisible?: boolean;
  mainImage: string;
  snippetTitle?: string | null;
  shopProducts?: ShopProductInterface[] | null;
  testId: number | string;
  slug: string;
  defaultView?: boolean;
}

const CartProductFrame: React.FC<CartProductFrameInterface> = ({
  cartProductId,
  children,
  isShopsVisible,
  mainImage,
  snippetTitle,
  shopProducts,
  testId,
  slug,
  defaultView,
}) => {
  const { deleteProductFromCart } = useSiteContext();

  return (
    <div className='space-y-4'>
      <LayoutCard
        defaultView={defaultView}
        className='grid px-6 py-8 gap-6 sm:grid-cols-8 relative min-h-[311px]'
        testId={'cart-product'}
      >
        {/*image*/}
        <div className='flex flex-col gap-4 items-center justify-center sm:col-span-2'>
          <div className='relative flex justify-center flex-shrink-0 w-full max-w-[180px]'>
            <div className='relative pb-[100%] w-full'>
              <WpImage
                url={mainImage}
                alt={`${snippetTitle}`}
                title={`${snippetTitle}`}
                width={240}
                className='absolute inset-0 w-full h-full object-contain'
              />
            </div>

            <WpLink
              target={'_blank'}
              className='block absolute z-10 inset-0 text-indent-full'
              href={`/${slug}`}
            >
              {snippetTitle}
            </WpLink>
          </div>
        </div>

        {/*main data*/}
        <div className='sm:col-span-6 flex flex-col'>{children}</div>

        {/*remove button*/}
        <ButtonCross
          testId={`cart-product-${testId}-remove-from-cart`}
          iconSize={'small'}
          className='absolute top-0 right-0 z-30'
          onClick={() => {
            deleteProductFromCart({
              cartProductId,
            });
          }}
        />
      </LayoutCard>

      {isShopsVisible ? (
        <CartShopsList shopProducts={shopProducts || []} cartProductId={cartProductId} />
      ) : null}
    </div>
  );
};

interface CartProductMainDataInterface {
  itemId: string;
  snippetTitle?: string | null;
  slug: string;
  name?: string | null;
}

const CartProductMainData: React.FC<CartProductMainDataInterface> = ({
  itemId,
  snippetTitle,
  slug,
  name,
}) => {
  return (
    <React.Fragment>
      <div className='text-secondary-text mb-3'>{`Артикул: ${itemId}`}</div>
      <div className='mb-6'>
        <WpLink
          target={'_blank'}
          className='block text-primary-text hover:no-underline hover:text-primary-text font-medium text-lg lg:text-2xl'
          href={`/${slug}`}
        >
          {snippetTitle}
        </WpLink>
        {name ? <div className='text-secondary-text mt-1'>{name}</div> : null}
      </div>
    </React.Fragment>
  );
};

interface CartProductPropsInterface {
  cartProduct: CartProductInterface;
  testId: number | string;
}

export const CartShoplessProduct: React.FC<CartProductPropsInterface> = ({
  cartProduct,
  testId,
}) => {
  const [isShopsVisible, setIsShopsVisible] = React.useState<boolean>(false);
  const { product, _id } = cartProduct;
  if (!product) {
    return null;
  }

  const { itemId, snippetTitle, shopProducts, minPrice, shopsCount, mainImage, slug } = product;

  return (
    <CartProductFrame
      slug={slug}
      testId={testId}
      cartProductId={`${_id}`}
      mainImage={mainImage}
      snippetTitle={snippetTitle}
      shopProducts={shopProducts}
      isShopsVisible={isShopsVisible}
    >
      <CartProductMainData
        name={product.name}
        slug={slug}
        itemId={itemId}
        snippetTitle={snippetTitle}
      />

      <div className='flex flex-wrap gap-6 mb-4 items-center'>
        <div>
          <div className='text-secondary-text'>Цена за ед.</div>
          <ProductSnippetPrice shopsCount={shopsCount} value={minPrice} />
        </div>

        <div className='flex justify-center items-center gap-4'>
          <ControlButton iconSize={'mid'} icon={'compare'} />
          <ControlButton iconSize={'mid'} icon={'heart'} />
        </div>
      </div>

      <WpButton
        onClick={() => {
          setIsShopsVisible(true);
        }}
        testId={`cart-product-${testId}-show-shops`}
      >
        Выбрать магазин
      </WpButton>
    </CartProductFrame>
  );
};

interface CartProductPropsWithAmountInterface extends CartProductPropsInterface {
  fieldName: string;
  defaultView?: boolean;
  shopIndex: number;
}

export const CartProduct: React.FC<CartProductPropsWithAmountInterface> = ({
  cartProduct,
  fieldName,
  testId,
  defaultView,
  shopIndex,
}) => {
  const { values } = useFormikContext();
  const { updateProductInCart } = useSiteContext();
  const { shopProduct, _id } = cartProduct;
  const minAmount = 1;
  const deliveryVariant = get(values, `shopConfigs[${shopIndex}].deliveryVariant`);
  const isCourierDelivery = deliveryVariant === ORDER_DELIVERY_VARIANT_COURIER;
  if (!shopProduct) {
    return null;
  }

  const { price, oldPrice, discountedPercent, available, shop, summary } = shopProduct;

  if (!shop || !summary) {
    return null;
  }

  return (
    <CartProductFrame
      defaultView={defaultView}
      slug={summary.slug}
      testId={testId}
      cartProductId={`${_id}`}
      mainImage={summary.mainImage}
      snippetTitle={summary.snippetTitle}
    >
      <CartProductMainData
        name={summary.name}
        slug={summary.slug}
        itemId={summary.itemId}
        snippetTitle={summary.snippetTitle}
      />

      <div className='flex flex-wrap gap-6 mt-auto'>
        <div>
          {/*shop product price*/}
          <div className='text-secondary-text'>Цена за ед.</div>
          <ProductShopPrices
            showDiscountedPrice={
              Boolean(cartProduct.promoProduct) &&
              noNaN(cartProduct.promoProduct?.discountPercent) > 0
            }
            price={price}
            oldPrice={oldPrice}
            discountedPercent={discountedPercent}
          />
          {cartProduct.promoProduct?.discountPercent ? (
            <div className='text-secondary-text'>
              {`Скидка по промокоду ${cartProduct.promoProduct?.discountPercent}%`}
            </div>
          ) : null}

          {/*available*/}
          {isCourierDelivery ? null : (
            <div className='text-secondary-text'>{`В наличии ${available} шт`}</div>
          )}
        </div>

        {/*amount input*/}
        <div>
          <FormikSpinnerInput
            name={fieldName}
            min={minAmount}
            max={isCourierDelivery ? undefined : noNaN(available)}
            testId={`cart-product-${testId}-amount`}
            plusTestId={`cart-product-${testId}-plus`}
            minusTestId={`cart-product-${testId}-minus`}
            frameClassName='w-[var(--buttonMinWidth)]'
            onChange={(e) => {
              updateProductInCart({
                amount: noNaN(e.target.value),
                cartProductId: _id,
              });
            }}
          />
        </div>

        <div className='flex justify-center self-start items-center gap-4'>
          <ControlButton iconSize={'mid'} icon={'compare'} />
          <ControlButton iconSize={'mid'} icon={'heart'} />
        </div>
      </div>
    </CartProductFrame>
  );
};
