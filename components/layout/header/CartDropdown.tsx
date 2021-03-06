import ButtonCross from 'components/button/ButtonCross';
import ControlButton from 'components/button/ControlButton';
import WpButton from 'components/button/WpButton';
import { useConfigContext } from 'components/context/configContext';
import { useNotificationsContext } from 'components/context/notificationsContext';
import { useSiteContext } from 'components/context/siteContext';
import Currency from 'components/Currency';
import SpinnerInput from 'components/FormElements/SpinnerInput/SpinnerInput';
import ProductSnippetPrice from 'components/layout/snippet/ProductSnippetPrice';
import ProductShopPrices from 'components/ProductShopPrices';
import WpImage from 'components/WpImage';
import { noNaN } from 'lib/numbers';
import { useRouter } from 'next/router';
import * as React from 'react';

const cartDropdownCssVars = {
  '--framePadding': '1.5rem',
  '--textLineGap': '0.5rem',
} as React.CSSProperties;

const productClassName = 'relative grid grid-cols-8 pb-16 px-2 gap-4';
const productImageClassName = 'relative col-span-2 flex items-start justify-center';
const productImageHolderClassName = 'w-full';
const productContentClassName = 'relative col-span-6';
const minAmount = 1;

const CartDropdown: React.FC = () => {
  const { cart } = useSiteContext();
  const router = useRouter();
  const { configs } = useConfigContext();
  const { showErrorNotification } = useNotificationsContext();
  const { deleteCartProduct, updateCartProduct, clearCart } = useSiteContext();
  if (!cart) {
    return null;
  }

  const { productsCount, cartDeliveryProducts, cartBookingProducts, totalPrice } = cart;

  return (
    <div
      className='relative w-[30rem] max-w-[calc(100vw-(var(--innerBlockHorizontalPadding)*2))] overflow-hidden rounded-lg bg-primary shadow-xl dark:bg-wp-dark-gray-200'
      style={cartDropdownCssVars}
      data-cy={'cart-dropdown'}
    >
      <div className='flex items-center justify-between p-[var(--framePadding)]'>
        <div className='text-xl font-bold'>
          Корзина <span className='font-normal text-secondary-text'>({productsCount})</span>
        </div>
        <div
          className='cursor-pointer text-theme hover:underline'
          data-cy={'clear-cart'}
          onClick={clearCart}
        >
          Очистить все
        </div>
      </div>
      <div className='max-h-[30rem] overflow-y-auto'>
        <div className='pt-[var(--framePadding)]'>
          {[...cartDeliveryProducts, ...cartBookingProducts].map((cartProduct, index) => {
            const { product, shopProduct, _id, amount } = cartProduct;

            if (shopProduct) {
              const { summary } = shopProduct;
              if (!summary) {
                return null;
              }

              return (
                <div
                  key={`${_id}`}
                  className={productClassName}
                  data-cy={`cart-dropdown-product-${index}`}
                >
                  <div className={productImageClassName}>
                    <div className={productImageHolderClassName}>
                      <div className='relative w-full pb-[100%]'>
                        <WpImage
                          url={`${summary.mainImage}`}
                          alt={`${summary.snippetTitle}`}
                          title={`${summary.snippetTitle}`}
                          width={100}
                          className='absolute inset-0 h-full w-full object-contain'
                        />
                      </div>
                    </div>
                  </div>
                  <div className={productContentClassName}>
                    <div className='mb-[var(--textLineGap)] pr-[var(--controlButtonHeightSmall)] text-lg font-medium'>
                      {summary.snippetTitle}
                    </div>

                    <ProductShopPrices
                      className='mb-[var(--textLineGap)]'
                      price={shopProduct.price}
                      oldPrice={shopProduct.oldPrice}
                      discountedPercent={shopProduct.discountedPercent}
                    />
                    {configs.isOneShopCompany ? null : (
                      <div className='mb-[var(--textLineGap)]'>
                        <span className='text-secondary-text'>магазин: </span>
                        <span className='font-medium'>{shopProduct?.shop?.name}</span>
                      </div>
                    )}

                    <div className='mt-4 flex items-center justify-between'>
                      <SpinnerInput
                        name={'amount'}
                        value={amount}
                        min={minAmount}
                        max={noNaN(shopProduct?.available)}
                        testId={`cart-dropdown-product-${index}-amount`}
                        plusTestId={`cart-dropdown-product-${index}-plus`}
                        minusTestId={`cart-dropdown-product-${index}-minus`}
                        frameClassName='w-[var(--buttonMinWidth)]'
                        size={'small'}
                        onChange={(e) => {
                          const amount = noNaN(e.target.value);
                          if (amount >= minAmount && amount <= noNaN(shopProduct?.available)) {
                            updateCartProduct({
                              amount,
                              cartProductId: `${_id}`,
                            });
                          }
                        }}
                      />

                      <div className='flex items-center justify-end'>
                        <div className='absolute top-0 right-0 z-[5]'>
                          <ButtonCross
                            testId={`cart-dropdown-product-${index}-remove-from-cart`}
                            iconSize={'smaller'}
                            size={'small'}
                            onClick={() => {
                              deleteCartProduct({
                                cartProductId: `${_id}`,
                              });
                            }}
                          />
                        </div>

                        <ControlButton iconSize={'small'} size={'small'} icon={'compare'} />
                        <ControlButton iconSize={'small'} size={'small'} icon={'heart'} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            if (!product) {
              return null;
            }

            const { snippetTitle, shopsCount, minPrice } = product;

            return (
              <div key={`${_id}`} className={productClassName} data-cy={`cart-dropdown-product`}>
                <div className={productImageClassName}>
                  <div className={productImageHolderClassName}>
                    <div className='relative w-full pb-[100%]'>
                      <WpImage
                        url={`${product.mainImage}`}
                        alt={`${product.snippetTitle}`}
                        title={`${product.snippetTitle}`}
                        width={100}
                        className='absolute inset-0 h-full w-full object-contain'
                      />
                    </div>
                  </div>
                </div>
                <div className={productContentClassName}>
                  <div className='mb-[var(--textLineGap)] pr-[var(--controlButtonHeightSmall)] text-lg font-medium'>
                    {snippetTitle}
                  </div>

                  <ProductSnippetPrice
                    shopsCount={shopsCount}
                    className='mb-[var(--textLineGap)]'
                    value={minPrice}
                  />
                  <div className='text-sm text-theme'>Магазин не выбран</div>

                  <div className='mt-4 flex items-center justify-between'>
                    <div className='ml-auto flex items-center justify-end'>
                      <div className='absolute top-0 right-0 z-[5]'>
                        <ButtonCross
                          testId={`cart-dropdown-product-${index}-remove-from-cart`}
                          iconSize={'smaller'}
                          size={'small'}
                          onClick={() => {
                            deleteCartProduct({
                              cartProductId: `${_id}`,
                            });
                          }}
                        />
                      </div>

                      <ControlButton iconSize={'small'} size={'small'} icon={'compare'} />
                      <ControlButton iconSize={'small'} size={'small'} icon={'heart'} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className='border-t border-wp-light-gray-100 bg-primary p-[var(--framePadding)] dark:border-wp-dark-gray-100 dark:bg-wp-dark-gray-100'>
        <div className='mb-[var(--framePadding)] flex items-center justify-between'>
          <div className='text-2xl text-secondary-text'>Итого</div>
          <div className='text-2xl font-medium text-primary-text'>
            <Currency value={totalPrice} />
          </div>
        </div>
        <WpButton
          testId={'cart-dropdown-continue'}
          className='lg:w-full'
          onClick={() => {
            router.push(`/cart`).catch(() => {
              showErrorNotification();
            });
          }}
        >
          Перейти в корзину
        </WpButton>
      </div>
    </div>
  );
};

export default CartDropdown;
