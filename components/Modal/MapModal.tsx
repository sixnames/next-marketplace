import WpMap, { WpMapInterface } from 'components/WpMap';
import * as React from 'react';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';

export interface MapModalInterface extends Omit<WpMapInterface, 'mapRef'> {
  title: string;
  testId?: string;
}

const MapModal: React.FC<MapModalInterface> = ({ title, testId, markers }) => {
  const mapRef = React.useRef<any>(null);

  return (
    <ModalFrame testId={testId} size={'midWide'}>
      <ModalTitle>{title}</ModalTitle>
      <WpMap mapRef={mapRef} markers={markers} />
    </ModalFrame>
  );
};

export default MapModal;
