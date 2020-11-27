import React from 'react';
import ModalFrame from '../ModalFrame';
import ModalTitle from '../ModalTitle';
import ModalText from '../ModalText';

const ShopProductModal: React.FC = () => {
  return (
    <ModalFrame testId={'cart-modal'} size={'small'}>
      <ModalTitle>Товар был добавлен в корзину</ModalTitle>
      <ModalText>Товаров в вашей корзине: 2</ModalText>
    </ModalFrame>
  );
};

export default ShopProductModal;
