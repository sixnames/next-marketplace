import ControlButton from 'components/ControlButton';
import WpImage from 'components/WpImage';
import { useAppContext } from 'context/appContext';
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
  showBullets = false,
  showFullscreenButton = false,
  showThumbnails = true,
  ...props
}) => {
  const { isMobile } = useAppContext();
  const items: ReactImageGalleryItem[] = assets.map(({ url }) => {
    return {
      original: url,
      thumbnail: url,
      renderItem: () => {
        return (
          <div className='px-6 md:px-8'>
            <div>
              <div className='relative pb-[100%] w-full'>
                <WpImage
                  url={url}
                  alt={url}
                  title={url}
                  width={480}
                  className='absolute inset-0 w-full h-full object-contain'
                />
              </div>
            </div>
          </div>
        );
      },
      renderThumbInner: () => {
        return (
          <div className='relative pb-[100%] w-full'>
            <WpImage
              url={url}
              alt={url}
              title={url}
              width={80}
              className='absolute inset-0 w-full h-full object-contain'
            />
          </div>
        );
      },
    };
  });

  return (
    <div className={`${className ? className : ''}`}>
      <ImageGallery
        showPlayButton={showPlayButton}
        showBullets={showBullets}
        showFullscreenButton={showFullscreenButton}
        showThumbnails={showThumbnails}
        thumbnailPosition={isMobile ? 'bottom' : 'left'}
        items={items}
        disableThumbnailScroll
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
