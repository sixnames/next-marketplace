import RequestError from 'components/RequestError';
import Spinner from 'components/Spinner';
import { useSiteContext } from 'context/siteContext';
import * as React from 'react';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import ModalText from 'components/Modal/ModalText';
import ModalButtons from 'components/Modal/ModalButtons';
import Button from 'components/button/Button';
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
  const { cart, loadingCart } = useSiteContext();

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
        <p>
          Товаров в вашей корзине:{' '}
          <span className='text-theme' data-cy={'cart-modal-counter'}>
            {productsCount}
          </span>
        </p>
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
