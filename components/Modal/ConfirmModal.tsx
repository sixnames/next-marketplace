import * as React from 'react';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import ModalText from 'components/Modal/ModalText';
import ModalButtons from 'components/Modal/ModalButtons';
import Button from 'components/Button';
import { useAppContext } from 'context/appContext';

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
        <Button onClick={hideModal} testId={'decline'}>
          Нет
        </Button>
        <Button theme={'secondary'} onClick={onConfirmHandler} testId={'confirm'}>
          Да
        </Button>
      </ModalButtons>
    </ModalFrame>
  );
};

export default ConfirmModal;
