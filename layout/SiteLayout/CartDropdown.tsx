import { useSiteContext } from 'context/siteContext';
import { CartInterface } from 'db/uiInterfaces';
import * as React from 'react';
import Image from 'next/image';
import ProductShopPrices from 'components/Product/ProductShopPrices/ProductShopPrices';
import ProductSnippetPrice from 'components/Product/ProductSnippetPrice/ProductSnippetPrice';
import ButtonCross from 'components/Buttons/ButtonCross';
import ControlButton from 'components/Buttons/ControlButton';
import SpinnerInput from 'components/FormElements/SpinnerInput/SpinnerInput';
import Currency from 'components/Currency/Currency';
import Button from 'components/Buttons/Button';
import { useRouter } from 'next/router';
import { useNotificationsContext } from 'context/notificationsContext';
import { noNaN } from 'lib/numbers';

interface CartDropdownInterface {
  cart: CartInterface;
}

const cartDropdownCssVars = {
  '--framePadding': '1.5rem',
  '--textLineGap': '0.5rem',
} as React.CSSProperties;

const productClassName = 'relative grid grid-cols-8 pb-[4rem] pr-1 gap-4';
const productImageClassName = 'relative min-h-[7rem] col-span-2';
const productImageHolderClassName =
  'absolute w-full h-full inset-0 flex items-center justify-center';
const productContentClassName = 'relative col-span-6';

const CartDropdown: React.FC<CartDropdownInterface> = ({ cart }) => {
  const router = useRouter();
  const { showErrorNotification } = useNotificationsContext();
  const { deleteProductFromCart, updateProductInCart, clearCart } = useSiteContext();
  const { productsCount, cartProducts, formattedTotalPrice } = cart;

  return (
    <div
      className='fixed overflow-hidden bottom-[var(--mobileNavHeight)] inset-x-0 w-full rounded-t-lg shadow-xl bg-primary-background dark:bg-wp-dark-gray-200 wp-desktop:relative wp-desktop:rounded-lg wp-desktop:bottom-auto wp-desktop:inset-x-auto wp-desktop:w-[30rem]'
      style={cartDropdownCssVars}
      data-cy={'cart-dropdown'}
    >
      <div className='flex items-center justify-between p-[var(--framePadding)]'>
        <div className='font-bold text-xl'>
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
          {cartProducts.map((cartProduct) => {
            const { product, shopProduct, _id, amount } = cartProduct;

            if (shopProduct) {
              const { mainImage, originalName, slug } = shopProduct;
              return (
                <div key={`${_id}`} className={productClassName} data-cy={`cart-dropdown-product`}>
                  <div className={productImageClassName}>
                    <div className={productImageHolderClassName}>
                      <Image
                        src={`${mainImage}`}
                        objectFit='contain'
                        alt={originalName}
                        title={originalName}
                        width={70}
                        height={185}
                      />
                    </div>
                  </div>
                  <div className={productContentClassName}>
                    <div className='text-lg font-medium pr-[var(--controlButtonHeightSmall)] mb-[var(--textLineGap)]'>
                      {originalName}
                    </div>

                    <ProductShopPrices
                      className='mb-[var(--textLineGap)]'
                      formattedPrice={shopProduct.formattedPrice}
                      formattedOldPrice={shopProduct.formattedOldPrice}
                      discountedPercent={shopProduct.discountedPercent}
                    />
                    <div className='mb-[var(--textLineGap)]'>
                      <span className='text-secondary-text'>винотека: </span>
                      <span className='font-medium'>{shopProduct?.shop?.name}</span>
                    </div>

                    <div className='flex items-center justify-between mt-4'>
                      <SpinnerInput
                        name={'amount'}
                        value={amount}
                        min={1}
                        testId={`cart-dropdown-${slug}-amount`}
                        plusTestId={`cart-dropdown-${slug}-plus`}
                        minusTestId={`cart-dropdown-${slug}-minus`}
                        size={'small'}
                        onChange={(e) => {
                          updateProductInCart({
                            amount: noNaN(e.target.value),
                            cartProductId: _id,
                          });
                        }}
                      />

                      <div className='flex items-center justify-end'>
                        <div className='absolute top-0 right-0 z-[5]'>
                          <ButtonCross
                            testId={`cart-dropdown-${slug}-remove-from-cart`}
                            iconSize={'smaller'}
                            size={'small'}
                            onClick={() => {
                              deleteProductFromCart({
                                cartProductId: _id,
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

            const { mainImage, originalName, shopsCount, cardPrices } = product;

            return (
              <div key={`${_id}`} className={productClassName} data-cy={`cart-dropdown-product`}>
                <div className={productImageClassName}>
                  <div className={productImageHolderClassName}>
                    <Image
                      src={`${mainImage}`}
                      objectFit='contain'
                      alt={originalName}
                      title={originalName}
                      width={70}
                      height={185}
                    />
                  </div>
                </div>
                <div className={productContentClassName}>
                  <div className='text-lg font-medium pr-[var(--controlButtonHeightSmall)] mb-[var(--textLineGap)]'>
                    {originalName}
                  </div>

                  <ProductSnippetPrice
                    shopsCount={shopsCount}
                    className='mb-[var(--textLineGap)]'
                    value={cardPrices?.min}
                  />
                  <div className='text-theme text-sm'>Винотека не выбрана</div>

                  <div className='flex items-center justify-between mt-4'>
                    <SpinnerInput
                      name={'amount'}
                      value={amount}
                      min={1}
                      testId={`cart-dropdown-${product.slug}-amount`}
                      plusTestId={`cart-dropdown-${product.slug}-plus`}
                      minusTestId={`cart-dropdown-${product.slug}-minus`}
                      size={'small'}
                      onChange={(e) => {
                        updateProductInCart({
                          amount: noNaN(e.target.value),
                          cartProductId: _id,
                        });
                      }}
                    />

                    <div className='flex items-center justify-end'>
                      <div className='absolute top-0 right-0 z-[5]'>
                        <ButtonCross
                          testId={`cart-dropdown-${product.slug}-remove-from-cart`}
                          iconSize={'smaller'}
                          size={'small'}
                          onClick={() => {
                            deleteProductFromCart({
                              cartProductId: _id,
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
      <div className='p-[var(--framePadding)] border-t border-wp-light-gray-100 bg-primary-background dark:bg-wp-dark-gray-100 dark:border-wp-dark-gray-100'>
        <div className='flex items-center justify-between mb-[var(--framePadding)]'>
          <div className='text-2xl text-secondary-text'>Итого</div>
          <div className='text-2xl text-primary-text font-medium'>
            <Currency value={formattedTotalPrice} />
          </div>
        </div>
        <Button
          className='wp-desktop:w-full'
          onClick={() => {
            router.push(`/cart`).catch(() => {
              showErrorNotification();
            });
          }}
        >
          оформить заказ
        </Button>
      </div>
    </div>
  );
};

export default CartDropdown;
