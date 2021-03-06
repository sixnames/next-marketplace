import ControlButton from 'components/button/ControlButton';
import { useAppContext } from 'components/context/appContext';
import WpImage from 'components/WpImage';
import * as React from 'react';
import ImageGallery, { ReactImageGalleryItem, ReactImageGalleryProps } from 'react-image-gallery';

const quality = 70;

interface CardImageSliderInterface
  extends Omit<ReactImageGalleryProps, 'items' | 'renderLeftNav' | 'renderRightNav'> {
  assets: string[];
  className?: string;
  arrowClassName?: string;
  arrowLeftClassName?: string;
  arrowRightClassName?: string;
  slideClassName?: string;
  imageWidth?: number;
  slideImageClassName?: string;
  slideTitle: string;
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
  slideClassName,
  slideImageClassName,
  imageWidth = 480,
  slideTitle,
  ...props
}) => {
  const { isMobile } = useAppContext();
  const items: ReactImageGalleryItem[] = assets.map((url, index) => {
    return {
      original: url,
      thumbnail: url,
      renderItem: () => {
        if (showThumbnails) {
          return (
            <div className='px-6 md:px-8'>
              <div>
                <div
                  className={`relative w-full pb-[100%] ${slideClassName ? slideClassName : ''}`}
                >
                  <WpImage
                    url={url}
                    quality={quality}
                    title={`${slideTitle} ${index}`}
                    alt={`${slideTitle} ${index}`}
                    width={imageWidth}
                    loading={'eager'}
                    className={`absolute inset-0 h-full w-full object-contain ${
                      slideImageClassName ? slideImageClassName : ''
                    }`}
                  />
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className={slideClassName}>
            <WpImage
              url={url}
              quality={quality}
              title={`${slideTitle} ${index}`}
              alt={`${slideTitle} ${index}`}
              width={imageWidth}
              loading={'eager'}
              className={`h-full w-full object-contain ${
                slideImageClassName ? slideImageClassName : ''
              }`}
            />
          </div>
        );
      },
      renderThumbInner: () => {
        return (
          <div className='relative w-full pb-[100%]'>
            <WpImage
              url={url}
              quality={quality}
              title={`${slideTitle}`}
              alt={`${slideTitle}`}
              width={80}
              loading={'eager'}
              className='absolute inset-0 h-full w-full object-contain'
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
        // disableThumbnailScroll
        renderLeftNav={(onClick, disabled) => {
          return (
            <div className={arrowLeftClassName}>
              <ControlButton
                icon={'chevron-left'}
                className={arrowClassName}
                onClick={onClick}
                disabled={disabled}
                ariaLabel={'prev image'}
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
                ariaLabel={'next image'}
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
