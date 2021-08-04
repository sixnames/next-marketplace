import ControlButton from 'components/ControlButton';
import { AssetModel } from 'db/dbModels';
import * as React from 'react';
import ImageGallery, { ReactImageGalleryItem, ReactImageGalleryProps } from 'react-image-gallery';

interface CardImageSliderInterface extends Omit<ReactImageGalleryProps, 'items'> {
  assets: AssetModel[];
  className?: string;
  controlButtonClassName?: string;
}

const CardImageSlider: React.FC<CardImageSliderInterface> = ({
  assets,
  controlButtonClassName = 'text-theme',
  className,
}) => {
  const items: ReactImageGalleryItem[] = assets.map(({ url }) => {
    return {
      original: url,
    };
  });

  return (
    <div className={`${className ? className : ''}`}>
      <ImageGallery
        showPlayButton={false}
        showBullets
        items={items}
        renderLeftNav={(onClick, disabled) => {
          return (
            <div className='absolute top-half left-6 z-40'>
              <ControlButton
                icon={'chevron-left'}
                className={controlButtonClassName}
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
                className={controlButtonClassName}
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
