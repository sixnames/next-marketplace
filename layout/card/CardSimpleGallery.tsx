import { AssetModel } from 'db/dbModels';
import Image from 'next/image';
import * as React from 'react';

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
          <Image
            src={`${mainImage}`}
            alt={alt}
            title={title}
            width={480}
            height={480}
            objectFit='contain'
          />
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className='overflow-x-auto lg:overflow-x-auto max-w-full pb-6'>
        <div className='flex mb-6 lg:mb-0 lg:grid lg:grid-cols-2 gap-x-6 gap-y-8'>
          {assets.map(({ url }, index) => {
            return (
              <div key={url} className='min-w-[260px] lg:min-w-full rounded-lg shadow-lg p-1'>
                <div className='relative'>
                  <Image
                    src={url}
                    alt={`${alt} photo ${index}`}
                    title={`${title} photo ${index}`}
                    width={400}
                    height={400}
                    objectFit='contain'
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
