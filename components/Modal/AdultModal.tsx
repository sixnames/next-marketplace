import * as React from 'react';
import { ADULT_KEY, ADULT_TRUE } from '../../config/common';
import { useAppContext } from '../../context/appContext';
import WpButton from '../button/WpButton';
import ModalFrame from './ModalFrame';
import ModalText from './ModalText';
import ModalTitle from './ModalTitle';

const AdultModal: React.FC = () => {
  const { hideModal } = useAppContext();
  return (
    <ModalFrame>
      <ModalTitle>Для доступа на сайт необходимо подтвердить возраст</ModalTitle>
      <ModalText>
        <p>
          Сайт содержит информацию, не рекомендованную для лиц, не достигших совершеннолетнего
          возраста. Сведения, размещенные на сайте, носят исключительно информационный характер и
          предназначены только для личного использования.
        </p>
      </ModalText>
      <WpButton
        onClick={() => {
          window.localStorage.setItem(ADULT_KEY, ADULT_TRUE);
          hideModal();
        }}
      >
        Мне исполнилось 18 лет
      </WpButton>
    </ModalFrame>
  );
};

export default AdultModal;
