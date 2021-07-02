import * as React from 'react';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';

export interface MapModalInterface {
  title: string;
  testId?: string;
}

const MapModal: React.FC<MapModalInterface> = ({ title, testId }) => {
  return (
    <ModalFrame testId={testId}>
      <ModalTitle>{title}</ModalTitle>
    </ModalFrame>
  );
};

export default MapModal;
