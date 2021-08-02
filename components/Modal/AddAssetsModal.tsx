import WpDropZone, { WpDropZoneInterface } from 'components/FormElements/Upload/WpDropZone';
import ModalText from 'components/Modal/ModalText';
import * as React from 'react';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';

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
