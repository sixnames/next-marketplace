import * as React from 'react';
import WpImage from '../../components/WpImage';
import { AssetModel } from '../../db/dbModels';

const quality = 70;

interface CardSimpleGalleryInterface {
  assets: AssetModel[];
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
        <div className='relative mb-12 lg:mb-0 w-full max-w-[480px] mx-auto'>
          <div className='relative pb-[100%] w-full'>
            <WpImage
              url={mainImage}
              alt={alt}
              title={title}
              width={550}
              className='absolute inset-0 w-full h-full object-contain'
              quality={quality}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className ? className : ''}`}>
      <div className='overflow-x-auto lg:overflow-x-auto max-w-full pb-6'>
        <div className='flex mb-6 lg:mb-0 lg:grid lg:grid-cols-2 gap-x-6 gap-y-8'>
          {assets.map(({ url }, index) => {
            return (
              <div key={url} className='min-w-[260px] lg:min-w-full rounded-lg shadow-lg p-1'>
                <div className='relative pb-[100%] w-full'>
                  <WpImage
                    url={url}
                    alt={`${alt} photo ${index}`}
                    title={`${title} photo ${index}`}
                    width={550}
                    className='absolute inset-0 w-full h-full object-contain'
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
