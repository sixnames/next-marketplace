import * as React from 'react';
import { useAppContext } from '../../context/appContext';
import WpButton from '../button/WpButton';
import ModalButtons from './ModalButtons';
import ModalFrame from './ModalFrame';
import ModalText from './ModalText';
import ModalTitle from './ModalTitle';

export interface ConfirmModalInterface {
  confirm?: () => void;
  message?: any;
  testId?: string;
}

const ConfirmModal: React.FC<ConfirmModalInterface> = ({ confirm, message, testId }) => {
  const { hideModal } = useAppContext();

  function onConfirmHandler() {
    if (confirm) {
      confirm();
    }
    hideModal();
  }

  return (
    <ModalFrame testId={testId}>
      <ModalTitle>Вы уверенны?</ModalTitle>

      <ModalText>
        <p>{message}</p>
      </ModalText>

      <ModalButtons>
        <WpButton onClick={hideModal} testId={'decline'}>
          Нет
        </WpButton>
        <WpButton theme={'secondary'} onClick={onConfirmHandler} testId={'confirm'}>
          Да
        </WpButton>
      </ModalButtons>
    </ModalFrame>
  );
};

export default ConfirmModal;
