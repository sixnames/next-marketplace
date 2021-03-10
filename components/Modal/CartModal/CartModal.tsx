import * as React from 'react';
import ModalFrame from '../ModalFrame';
import ModalTitle from '../ModalTitle';
import ModalText from '../ModalText';
import ModalButtons from '../ModalButtons';
import Button from '../../Buttons/Button';
import { useAppContext } from 'context/appContext';
import { useRouter } from 'next/router';
import { useNotificationsContext } from 'context/notificationsContext';
import { useSiteContext } from 'context/siteContext';

export interface CartModalInterface {
  title?: string;
}

const CartModal: React.FC<CartModalInterface> = ({ title = 'Товар был добавлен в корзину' }) => {
  const router = useRouter();
  const { hideModal } = useAppContext();
  const { showErrorNotification } = useNotificationsContext();
  const { cart } = useSiteContext();
  const { productsCount } = cart;

  function navigateToCartRoute() {
    hideModal();
    router.push(`/${router.query.city}/cart`).catch(() => {
      showErrorNotification();
    });
  }

  return (
    <ModalFrame testId={'cart-modal'} size={'small'}>
      <ModalTitle size={'small'} low>
        {title}
      </ModalTitle>
      <ModalText>
        Товаров в вашей корзине: <mark data-cy={'cart-modal-counter'}>{productsCount}</mark>
      </ModalText>
      <ModalButtons>
        <Button theme={'secondary'} onClick={hideModal} testId={`cart-modal-close`}>
          продолжить покупки
        </Button>
        <Button onClick={navigateToCartRoute} testId={`cart-modal-continue`}>
          перейти в корзину
        </Button>
      </ModalButtons>
    </ModalFrame>
  );
};

export default CartModal;
