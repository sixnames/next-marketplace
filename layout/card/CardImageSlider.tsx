import ControlButton from 'components/ControlButton';
import { AssetModel } from 'db/dbModels';
import * as React from 'react';
import ImageGallery from 'react-image-gallery';

interface CardImageSliderInterface {
  assets: AssetModel[];
}

const CardImageSlider: React.FC<CardImageSliderInterface> = ({ assets }) => {
  const items = assets.map(({ url }) => {
    return {
      original: url,
    };
  });
  return (
    <div>
      <ImageGallery
        showPlayButton={false}
        showBullets
        items={items}
        renderLeftNav={(onClick, disabled) => {
          return (
            <div className='absolute top-half left-6 z-40'>
              <ControlButton
                icon={'chevron-left'}
                className='text-theme'
                onClick={onClick}
                disabled={disabled}
              />
            </div>
          );
        }}
        renderRightNav={(onClick, disabled) => {
          return (
            <div className='absolute top-half right-6 z-40'>
              <ControlButton
                icon={'chevron-right'}
                className='text-theme'
                onClick={onClick}
                disabled={disabled}
              />
            </div>
          );
        }}
      />
    </div>
  );
};

export default CardImageSlider;
