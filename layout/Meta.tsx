import * as React from 'react';
import Head from 'next/head';
import { useConfigContext } from 'context/configContext';

export interface PageUrlsInterface {
  canonicalUrl: string;
  siteUrl: string;
  domain: string;
}

interface MetaInterface {
  title?: string;
  description?: string;
  previewImage?: string;
  pageUrls: PageUrlsInterface;
  siteName?: string;
  foundationYear?: string;
}

const Meta: React.FC<MetaInterface> = ({
  title,
  description,
  siteName,
  foundationYear,
  pageUrls,
  previewImage,
}) => {
  const { getSiteConfigSingleValue } = useConfigContext();

  const configTitle = getSiteConfigSingleValue('pageDefaultTitle');
  const pageTitle = title || configTitle;

  const configDescription = getSiteConfigSingleValue('pageDefaultDescription');
  const pageDescription = description || `${configDescription}`;

  const configPreviewImage = getSiteConfigSingleValue('pageDefaultPreviewImage');
  const pagePreviewImage = previewImage || `${configPreviewImage}`;

  const configSiteName = getSiteConfigSingleValue('siteName');
  const pageSiteName = siteName || `${configSiteName}`;

  const configFoundationYear = getSiteConfigSingleValue('siteFoundationYear');
  const pageFoundationYear = foundationYear || `${configFoundationYear}`;

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta
        name='viewport'
        content={`minimum-scale=1, height=device-height, width=device-width, initial-scale=1.0`}
      />
      <meta name={'description'} content={pageDescription} />

      <meta name='author' content={pageSiteName} />
      <meta
        name='copyright'
        content={`© ${pageFoundationYear} - ${new Date().getFullYear()} ${pageSiteName}™`}
      />
      <meta name='application-name' content='Personal Website' />

      <meta property='og:title' content={title} />
      <meta property='og:type' content='website' />
      <meta property='og:image' content={pagePreviewImage} />
      <meta property='og:url' content={pageUrls.canonicalUrl} />
      <meta property='og:description' content={pageDescription} />

      <meta name='twitter:title' content={title} />
      <meta name='twitter:card' content='summary' />
      <meta name='twitter:image' content={pagePreviewImage} />
      <meta name='twitter:description' content={pageDescription} />

      <link rel='icon' href={'/favicon.ico'} />
      <link rel='icon' href={'/icon.svg'} type={'image/svg+xml'} />
      <link rel={'apple-touch-icon'} href={'/apple-touch-icon.png'} />
      <link rel={'manifest'} href={'/site.webmanifest'} />

      <meta name='msapplication-TileColor' content='#ffffff' />
      <meta name='theme-color' content='#ffffff' />

      <meta name='yandex-verification' content='579c17148b497788' />

      {/*Fonts*/}
      <link
        rel={'preload'}
        href={'/fonts/Gilroy-Regular.woff2'}
        as='font'
        type='font/woff2'
        crossOrigin='anonymous'
      />
      <link
        rel={'preload'}
        href={'/fonts/Gilroy-Bold.woff2'}
        as='font'
        type='font/woff2'
        crossOrigin='anonymous'
      />
      <link
        rel={'preload'}
        href={'/fonts/Gilroy-Medium.woff2'}
        as='font'
        type='font/woff2'
        crossOrigin='anonymous'
      />
      <link
        rel={'preload'}
        href={'/fonts/Gilroy-Light.woff2'}
        as='font'
        type='font/woff2'
        crossOrigin='anonymous'
      />
      <link
        rel={'preload'}
        href={'/fonts/Gilroy-Regular.woff'}
        as='font'
        type='font/woff'
        crossOrigin='anonymous'
      />
      <link
        rel={'preload'}
        href={'/fonts/Gilroy-Bold.woff'}
        as='font'
        type='font/woff'
        crossOrigin='anonymous'
      />
      <link
        rel={'preload'}
        href={'/fonts/Gilroy-Medium.woff'}
        as='font'
        type='font/woff'
        crossOrigin='anonymous'
      />
      <link
        rel={'preload'}
        href={'/fonts/Gilroy-Light.woff'}
        as='font'
        type='font/woff'
        crossOrigin='anonymous'
      />
    </Head>
  );
};

export default Meta;
