import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import * as React from 'react';

export interface OptionsModalInterface {
  title: string;
}

const OptionsModal: React.FC<OptionsModalInterface> = ({ title }) => {
  return (
    <ModalFrame>
      <ModalTitle>{title}</ModalTitle>
    </ModalFrame>
  );
};

export default OptionsModal;
