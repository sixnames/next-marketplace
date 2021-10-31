import * as React from 'react';

interface WpImageInterface {
  url: string;
  alt: string;
  title: string;
  width: number;
  format?: string;
  className?: string;
}

const WpImage: React.FC<WpImageInterface> = ({
  className,
  url,
  alt,
  title,
  width,
  format = 'webp',
}) => {
  return (
    <picture>
      <source
        type={`image/${format}`}
        srcSet={`${url}?format=${format}&width=${width} 1x, ${url}?format=${format}&width=${
          width * 2
        } 2x`}
      />
      <source
        type={'image/png'}
        srcSet={`${url}?format=png&width=${width} 1x, ${url}?format=png&width=${width * 2} 2x`}
      />
      <img
        className={className}
        src={`${url}?format=png&width=${width}`}
        alt={alt}
        title={title}
        width={width}
        loading={'lazy'}
      />
    </picture>
  );
};

export default WpImage;
