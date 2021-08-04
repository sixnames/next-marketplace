import ControlButton from 'components/ControlButton';
import { AssetModel } from 'db/dbModels';
import * as React from 'react';
import ImageGallery, { ReactImageGalleryItem, ReactImageGalleryProps } from 'react-image-gallery';

interface CardImageSliderInterface
  extends Omit<ReactImageGalleryProps, 'items' | 'renderLeftNav' | 'renderRightNav'> {
  assets: AssetModel[];
  className?: string;
  arrowClassName?: string;
  arrowLeftClassName?: string;
  arrowRightClassName?: string;
}

const CardImageSlider: React.FC<CardImageSliderInterface> = ({
  assets,
  arrowClassName = 'text-theme',
  className,
  arrowLeftClassName = 'absolute top-half left-6 z-40',
  arrowRightClassName = 'absolute top-half right-6 z-40',
  showPlayButton = false,
  showBullets = true,
  ...props
}) => {
  const items: ReactImageGalleryItem[] = assets.map(({ url }) => {
    return {
      original: url,
    };
  });

  return (
    <div className={`${className ? className : ''}`}>
      <ImageGallery
        showPlayButton={showPlayButton}
        showBullets={showBullets}
        items={items}
        renderLeftNav={(onClick, disabled) => {
          return (
            <div className={arrowLeftClassName}>
              <ControlButton
                icon={'chevron-left'}
                className={arrowClassName}
                onClick={onClick}
                disabled={disabled}
              />
            </div>
          );
        }}
        renderRightNav={(onClick, disabled) => {
          return (
            <div className={arrowRightClassName}>
              <ControlButton
                icon={'chevron-right'}
                className={arrowClassName}
                onClick={onClick}
                disabled={disabled}
              />
            </div>
          );
        }}
        {...props}
      />
    </div>
  );
};

export default CardImageSlider;
