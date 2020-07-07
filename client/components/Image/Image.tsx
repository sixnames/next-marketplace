import React from 'react';
import { ASSETS_URL } from '../../config';

interface ImageInterface {
  url: string;
  alt: string;
  title: string;
  width: number;
}

const Image: React.FC<ImageInterface> = ({ url, alt, title, width }) => {
  const src = `${ASSETS_URL}${url}?width=${width}`;

  return (
    <picture>
      <source srcSet={src} type={'image/webp'} />
      <source srcSet={`${src}&format=png`} type={'image/png'} />
      <img src={src} width={width} alt={alt} title={title} loading={'lazy'} />
    </picture>
  );
};

export default Image;
