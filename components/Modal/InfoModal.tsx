import ModalFrame from 'components/Modal/ModalFrame';
import ModalText from 'components/Modal/ModalText';
import ModalTitle from 'components/Modal/ModalTitle';
import * as React from 'react';

export interface InfoModalInterface {
  title?: string;
  message?: string;
  testId: string;
}

const InfoModal: React.FC<InfoModalInterface> = ({ title, message, testId }) => {
  return (
    <ModalFrame testId={testId}>
      {title ? <ModalTitle>{title}</ModalTitle> : null}
      {message ? (
        <ModalText>
          <p>{message}</p>
        </ModalText>
      ) : null}
    </ModalFrame>
  );
};

export default InfoModal;
