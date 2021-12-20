import * as React from 'react';
import WpMap, { WpMapInterface } from '../WpMap';
import ModalFrame from './ModalFrame';
import ModalTitle from './ModalTitle';

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
