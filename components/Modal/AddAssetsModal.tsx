import * as React from 'react';
import WpDropZone, { WpDropZoneInterface } from '../FormElements/Upload/WpDropZone';
import ModalFrame from './ModalFrame';
import ModalText from './ModalText';
import ModalTitle from './ModalTitle';

export interface AddAssetsModalInterface extends Omit<WpDropZoneInterface, 'testId'> {
  message?: any;
  title?: string;
  testId?: string;
  dropZoneTextId?: string;
}

const AddAssetsModal: React.FC<AddAssetsModalInterface> = ({
  title,
  message,
  testId,
  dropZoneTextId,
  ...props
}) => {
  return (
    <ModalFrame testId={testId}>
      <ModalTitle>{title || 'Выберите изображение'}</ModalTitle>

      {message ? (
        <ModalText>
          <p>{message}</p>
        </ModalText>
      ) : null}

      <WpDropZone testId={dropZoneTextId} {...props} />
    </ModalFrame>
  );
};

export default AddAssetsModal;
