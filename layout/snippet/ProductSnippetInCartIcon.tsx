import Icon from 'components/Icon';
import WpTooltip from 'components/WpTooltip';
import { useIsInCart, UseIsInCartInterface } from 'hooks/useIsInCart';
import * as React from 'react';

const ProductSnippetInCartIcon: React.FC<UseIsInCartInterface> = (props) => {
  const inCart = useIsInCart(props);
  if (!inCart.isInCart) {
    return null;
  }

  return (
    <div className='absolute z-50 top-4 right-4 text-theme w-8 h-8 flex items-center justify-center'>
      <WpTooltip title={`В корзине ${inCart.inCartCount}`}>
        <Icon name={'cart'} className='w-6 h-6' />
      </WpTooltip>
    </div>
  );
};

export default ProductSnippetInCartIcon;
