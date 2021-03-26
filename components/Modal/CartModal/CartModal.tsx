import RequestError from 'components/RequestError/RequestError';
import Spinner from 'components/Spinner/Spinner';
import useCart from 'hooks/useCart';
import * as React from 'react';
import ModalFrame from '../ModalFrame';
import ModalTitle from '../ModalTitle';
import ModalText from '../ModalText';
import ModalButtons from '../ModalButtons';
import Button from '../../Buttons/Button';
import { useAppContext } from 'context/appContext';
import { useRouter } from 'next/router';
import { useNotificationsContext } from 'context/notificationsContext';

export interface CartModalInterface {
  title?: string;
}

const CartModal: React.FC<CartModalInterface> = ({ title = 'Товар был добавлен в корзину' }) => {
  const router = useRouter();
  const { hideModal } = useAppContext();
  const { showErrorNotification } = useNotificationsContext();
  const { cart, loadingCart } = useCart();

  if (loadingCart && !cart) {
    return (
      <ModalFrame testId={'cart-modal'} size={'small'}>
        <ModalTitle size={'small'} low>
          {title}
        </ModalTitle>
        <Spinner isNested />
      </ModalFrame>
    );
  }

  if (!cart) {
    return (
      <ModalFrame testId={'cart-modal'} size={'small'}>
        <ModalTitle size={'small'} low>
          {title}
        </ModalTitle>
        <RequestError />
      </ModalFrame>
    );
  }

  const { productsCount } = cart;

  return (
    <ModalFrame testId={'cart-modal'} size={'small'}>
      <ModalTitle size={'small'} low>
        {title}
      </ModalTitle>
      <ModalText>
        Товаров в вашей корзине: <span data-cy={'cart-modal-counter'}>{productsCount}</span>
      </ModalText>
      <ModalButtons>
        <Button theme={'secondary'} onClick={hideModal} testId={`cart-modal-close`}>
          продолжить покупки
        </Button>
        <Button
          onClick={() => {
            hideModal();
            router.push(`/cart`).catch(() => {
              showErrorNotification();
            });
          }}
          testId={`cart-modal-continue`}
        >
          перейти в корзину
        </Button>
      </ModalButtons>
    </ModalFrame>
  );
};

export default CartModal;
