import * as React from 'react';
import { useRouter } from 'next/router';
import { useAppContext } from '../../context/appContext';
import { useNotificationsContext } from '../../context/notificationsContext';
import { useSiteContext } from '../../context/siteContext';
import WpButton from '../button/WpButton';
import RequestError from '../RequestError';
import Spinner from '../Spinner';
import ModalButtons from './ModalButtons';
import ModalFrame from './ModalFrame';
import ModalText from './ModalText';
import ModalTitle from './ModalTitle';

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
        <WpButton theme={'secondary'} onClick={hideModal} testId={`cart-modal-close`}>
          продолжить покупки
        </WpButton>
        <WpButton
          onClick={() => {
            hideModal();
            router.push(`/cart`).catch(() => {
              showErrorNotification();
            });
          }}
          testId={`cart-modal-continue`}
        >
          перейти в корзину
        </WpButton>
      </ModalButtons>
    </ModalFrame>
  );
};

export default CartModal;
