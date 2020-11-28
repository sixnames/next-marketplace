import React from 'react';
import ModalFrame from '../ModalFrame';
import ModalTitle from '../ModalTitle';
import ModalText from '../ModalText';
import { useSiteContext } from '../../../context/siteContext';

const ShopProductModal: React.FC = () => {
  const { cart } = useSiteContext();
  const { productsCount } = cart;

  return (
    <ModalFrame testId={'cart-modal'} size={'small'}>
      <ModalTitle size={'small'} low>
        Товар был добавлен в корзину
      </ModalTitle>
      <ModalText>
        Товаров в вашей корзине: <mark data-cy={'cart-modal-counter'}>{productsCount}</mark>
      </ModalText>
    </ModalFrame>
  );
};

export default ShopProductModal;
