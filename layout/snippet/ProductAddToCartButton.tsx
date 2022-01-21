import { useRouter } from 'next/router';
import * as React from 'react';
import WpButton, { ButtonPropsInterface } from '../../components/button/WpButton';
import { useSiteContext } from '../../context/siteContext';
import { useSetSessionLogHandler } from '../../hooks/mutations/useSessionLogMutations';
import { useIsInCart, UseIsInCartInterface } from '../../hooks/useIsInCart';

interface ProductAddToCartButtonInterface extends ButtonPropsInterface, UseIsInCartInterface {
  available: number;
}

const ProductAddToCartButton: React.FC<ProductAddToCartButtonInterface> = ({
  shopProductIds,
  productId,
  frameClassName,
  available,
  ...props
}) => {
  const router = useRouter();
  const { addShoplessProductToCart, addProductToCart } = useSiteContext();
  const logHandler = useSetSessionLogHandler();
  const inCart = useIsInCart({
    productId,
    shopProductIds,
  });

  if (available < 1) {
    return <div className='text-theme'>Нет в наличии</div>;
  }

  return (
    <WpButton
      {...props}
      theme={inCart.isInCart ? 'secondary' : 'primary'}
      ariaLabel={'Добавить в корзину'}
      frameClassName={frameClassName || 'w-auto'}
      onClick={() => {
        if (shopProductIds && shopProductIds.length < 2) {
          addProductToCart({
            amount: 1,
            productId: productId,
            shopProductId: `${shopProductIds[0]}`,
          });
        } else {
          addShoplessProductToCart({
            amount: 1,
            productId: productId,
          });
        }
        logHandler({
          event: {
            variant: 'addToCartClick',
            asPath: router.asPath,
            productId: `${productId}`,
          },
        });
      }}
    >
      {inCart.isInCart ? `В корзине ${inCart.inCartCount} шт.` : 'В корзину'}
    </WpButton>
  );
};

export default ProductAddToCartButton;
