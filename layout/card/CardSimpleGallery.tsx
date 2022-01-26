import * as React from 'react';
import WpImage from '../../components/WpImage';

const quality = 70;

interface CardSimpleGalleryInterface {
  assets: string[];
  mainImage: string;
  isSingleImage: boolean;
  className?: string;
  alt: string;
  title: string;
}

const CardSimpleGallery: React.FC<CardSimpleGalleryInterface> = ({
  assets,
  alt,
  title,
  className,
  mainImage,
  isSingleImage,
}) => {
  if (isSingleImage) {
    return (
      <div className={className}>
        <div className='relative mx-auto mb-12 w-full max-w-[480px] lg:mb-0'>
          <div className='relative w-full pb-[100%]'>
            <WpImage
              url={mainImage}
              alt={alt}
              title={title}
              width={550}
              className='absolute inset-0 h-full w-full object-contain'
              quality={quality}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className ? className : ''}`}>
      <div className='max-w-full overflow-x-auto pb-6 lg:overflow-x-visible'>
        <div className='mb-6 flex gap-x-6 gap-y-8 lg:mb-0 lg:grid lg:grid-cols-2'>
          {assets.map((url, index) => {
            return (
              <div
                key={url}
                className='shadow-full min-w-[260px] rounded-lg bg-primary p-1 transition-all hover:scale-125 lg:min-w-full'
              >
                <div className='relative w-full pb-[100%]'>
                  <WpImage
                    url={url}
                    alt={`${alt} photo ${index}`}
                    title={`${title} photo ${index}`}
                    width={550}
                    className='absolute inset-0 h-full w-full object-contain'
                    quality={quality}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CardSimpleGallery;
