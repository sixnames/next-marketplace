import * as React from 'react';
import { useAppContext } from '../context/appContext';

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
        media='(max-width: 320px)'
        srcSet={`${url}?format=${format}&width=${
          width / 2
        }${qualityParam}${companySlugParam} 1x, ${url}?format=${format}&width=${width}${qualityParam}${companySlugParam} 2x`}
      />

      <source
        media='(max-width: 768px)'
        srcSet={`${url}?format=${format}&width=${
          width / 1.5
        }${qualityParam}${companySlugParam} 1x, ${url}?format=${format}&width=${
          (width / 1.5) * 2
        }${qualityParam}${companySlugParam} 2x`}
      />

      <source
        media='(min-width: 769px)'
        type={`image/${format}`}
        srcSet={`${url}?format=${format}&width=${width}${qualityParam}${companySlugParam} 1x, ${url}?format=${format}&width=${
          width * 2
        }${qualityParam}${companySlugParam} 2x`}
      />
      <source
        media='(min-width: 769px)'
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
