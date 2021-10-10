import { useConfigContext } from 'context/configContext';
import { useSiteContext } from 'context/siteContext';
import { CartInterface } from 'db/uiInterfaces';
import * as React from 'react';
import Image from 'next/image';
import ProductShopPrices from 'components/ProductShopPrices';
import ProductSnippetPrice from 'layout/snippet/ProductSnippetPrice';
import ButtonCross from 'components/ButtonCross';
import ControlButton from 'components/ControlButton';
import SpinnerInput from 'components/FormElements/SpinnerInput/SpinnerInput';
import Currency from 'components/Currency';
import Button from 'components/Button';
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

const productClassName = 'relative grid grid-cols-8 pb-16 px-2 gap-4';
const productImageClassName = 'relative col-span-2 flex items-center justify-center';
const productImageHolderClassName = 'w-16';
const productContentClassName = 'relative col-span-6';

const CartDropdown: React.FC<CartDropdownInterface> = ({ cart }) => {
  const router = useRouter();
  const { configs } = useConfigContext();
  const { showErrorNotification } = useNotificationsContext();
  const { deleteProductFromCart, updateProductInCart, clearCart } = useSiteContext();
  const { productsCount, cartProducts, formattedTotalPrice } = cart;
  const minAmount = 1;

  return (
    <div
      className='shadow-xl overflow-hidden bg-primary dark:bg-wp-dark-gray-200 relative rounded-lg w-[30rem] max-w-[calc(100vw-(var(--innerBlockHorizontalPadding)*2))]'
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
          {cartProducts.map((cartProduct, index) => {
            const { product, shopProduct, _id, amount } = cartProduct;

            if (shopProduct) {
              const { product } = shopProduct;
              if (!product) {
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
                      <Image
                        src={`${product.mainImage}`}
                        objectFit='contain'
                        alt={`${product.snippetTitle}`}
                        title={`${product.snippetTitle}`}
                        width={70}
                        height={185}
                      />
                    </div>
                  </div>
                  <div className={productContentClassName}>
                    <div className='text-lg font-medium pr-[var(--controlButtonHeightSmall)] mb-[var(--textLineGap)]'>
                      {product.snippetTitle}
                    </div>

                    <ProductShopPrices
                      className='mb-[var(--textLineGap)]'
                      price={shopProduct.price}
                      oldPrice={shopProduct.oldPrice}
                      discountedPercent={shopProduct.discountedPercent}
                    />
                    <div className='mb-[var(--textLineGap)]'>
                      <span className='text-secondary-text'>магазин: </span>
                      <span className='font-medium'>{shopProduct?.shop?.name}</span>
                    </div>

                    <div className='flex items-center justify-between mt-4'>
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
                            updateProductInCart({
                              amount,
                              cartProductId: _id,
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

            const { mainImage, snippetTitle, shopsCount, cardPrices } = product;

            return (
              <div key={`${_id}`} className={productClassName} data-cy={`cart-dropdown-product`}>
                <div className={productImageClassName}>
                  <div className={productImageHolderClassName}>
                    <Image
                      src={`${mainImage}`}
                      objectFit='contain'
                      alt={`${snippetTitle}`}
                      title={`${snippetTitle}`}
                      width={70}
                      height={185}
                    />
                  </div>
                </div>
                <div className={productContentClassName}>
                  <div className='text-lg font-medium pr-[var(--controlButtonHeightSmall)] mb-[var(--textLineGap)]'>
                    {snippetTitle}
                  </div>

                  <ProductSnippetPrice
                    shopsCount={shopsCount}
                    className='mb-[var(--textLineGap)]'
                    value={cardPrices?.min}
                  />
                  <div className='text-theme text-sm'>Магазин не выбран</div>

                  <div className='flex items-center justify-between mt-4'>
                    <div className='flex items-center justify-end ml-auto'>
                      <div className='absolute top-0 right-0 z-[5]'>
                        <ButtonCross
                          testId={`cart-dropdown-product-${index}-remove-from-cart`}
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
      <div className='p-[var(--framePadding)] border-t border-wp-light-gray-100 bg-primary dark:bg-wp-dark-gray-100 dark:border-wp-dark-gray-100'>
        <div className='flex items-center justify-between mb-[var(--framePadding)]'>
          <div className='text-2xl text-secondary-text'>Итого</div>
          <div className='text-2xl text-primary-text font-medium'>
            <Currency value={formattedTotalPrice} />
          </div>
        </div>
        <Button
          testId={'cart-dropdown-continue'}
          className='lg:w-full'
          onClick={() => {
            router.push(`/cart`).catch(() => {
              showErrorNotification();
            });
          }}
        >
          {configs.buyButtonText}
        </Button>
      </div>
    </div>
  );
};

export default CartDropdown;
