import { useAppContext } from 'context/appContext';
import * as React from 'react';

interface WpImageInterface {
  url: string;
  alt: string;
  title: string;
  width: number;
  format?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  quality?: number;
}

const WpImage: React.FC<WpImageInterface> = ({
  className,
  url,
  alt,
  title,
  width,
  format = 'webp',
  loading = 'lazy',
  quality,
}) => {
  const { companySlug } = useAppContext();
  const qualityParam = quality ? `&quality=${quality}` : '';
  const companySlugParam = `&companySlug=${companySlug}`;
  return (
    <picture>
      <source
        type={`image/${format}`}
        srcSet={`${url}?format=${format}&width=${width}${qualityParam}${companySlugParam} 1x, ${url}?format=${format}&width=${
          width * 2
        }${qualityParam}${companySlugParam} 2x`}
      />
      <source
        type={'image/png'}
        srcSet={`${url}?format=png&width=${width}${qualityParam}${companySlugParam} 1x, ${url}?format=png&width=${
          width * 2
        }${qualityParam} 2x`}
      />
      <img
        className={className}
        src={`${url}?format=png&width=${width}${qualityParam}${companySlugParam}`}
        alt={alt}
        title={title}
        width={width}
        height={width}
        loading={loading}
      />
    </picture>
  );
};

export default WpImage;
