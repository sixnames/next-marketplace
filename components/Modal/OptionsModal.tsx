import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import * as React from 'react';

interface OptionInterface extends Record<string, any> {
  _id: any;
  name: string;
}

export interface OptionsModalInterface {
  title: string;
  options: OptionInterface[];
}

const OptionsModal: React.FC<OptionsModalInterface> = ({ title }) => {
  return (
    <ModalFrame>
      <ModalTitle>{title}</ModalTitle>
    </ModalFrame>
  );
};

export default OptionsModal;
