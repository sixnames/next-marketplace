import WpButton, { ButtonPropsInterface } from 'components/button/WpButton';
import { useSiteContext } from 'context/siteContext';
import { useIsInCart, UseIsInCartInterface } from 'hooks/useIsInCart';
import * as React from 'react';

interface ProductAddToCartButtonInterface extends ButtonPropsInterface, UseIsInCartInterface {
  available: number;
}

const ProductAddToCartButton: React.FC<ProductAddToCartButtonInterface> = ({
  shopProductsIds,
  productId,
  frameClassName,
  available,
  ...props
}) => {
  const { addShoplessProductToCart, addProductToCart } = useSiteContext();
  const inCart = useIsInCart({
    productId,
    shopProductsIds,
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
        if (shopProductsIds && shopProductsIds.length < 2) {
          addProductToCart({
            amount: 1,
            productId: productId,
            shopProductId: `${shopProductsIds[0]}`,
          });
        } else {
          addShoplessProductToCart({
            amount: 1,
            productId: productId,
          });
        }
      }}
    >
      {inCart.isInCart ? `В корзине ${inCart.inCartCount} шт.` : 'В корзину'}
    </WpButton>
  );
};

export default ProductAddToCartButton;
