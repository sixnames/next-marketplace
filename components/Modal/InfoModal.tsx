import * as React from 'react';
import ModalFrame from './ModalFrame';
import ModalText from './ModalText';
import ModalTitle from './ModalTitle';

export interface InfoModalInterface {
  title?: string;
  message?: any;
  testId: string;
}

const InfoModal: React.FC<InfoModalInterface> = ({ title, message, testId }) => {
  return (
    <ModalFrame testId={testId}>
      {title ? <ModalTitle>{title}</ModalTitle> : null}
      {message ? <ModalText>{message}</ModalText> : null}
    </ModalFrame>
  );
};

export default InfoModal;
