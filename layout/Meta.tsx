import * as React from 'react';
import Head from 'next/head';
import { useConfigContext } from 'context/configContext';
import parse from 'html-react-parser';

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

  // Icons
  const appleTouchIcon = getSiteConfigSingleValue('apple-touch-icon');
  const faviconIco = getSiteConfigSingleValue('favicon.ico');
  const iconSvg = getSiteConfigSingleValue('icon.svg');

  // Metrics
  //<!-- Yandex.Metrika counter --> <!-- /Yandex.Metrika counter -->
  //<!-- Global site tag (gtag.js) - Google Analytics -->
  const yaVerification = getSiteConfigSingleValue('yaVerification') || '';
  // const yaMetrica = getSiteConfigSingleValue('yaMetrica') || '';
  // const googleAnalytics = getSiteConfigSingleValue('googleAnalytics') || '';
  // const metricsCodeAsString = `${yaVerification}${yaMetrica}${googleAnalytics}`;

  return (
    <React.Fragment>
      {/*<head dangerouslySetInnerHTML={{ __html: metricsCodeAsString }} />*/}
      <Head>
        {'<!-- Yandex.Metrika counter --> <!-- /Yandex.Metrika counter -->'}
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

        <link rel='icon' href={`${faviconIco}`} />
        <link rel='icon' href={`${iconSvg}`} type={'image/svg+xml'} />
        <link rel={'apple-touch-icon'} href={`${appleTouchIcon}`} />
        <link rel={'manifest'} href={'/site.webmanifest'} />

        <meta name='theme-color' content='#ffffff' />

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

        {/* Metrics */}
        {yaVerification
          ? parse(yaVerification, {
              trim: true,
            })
          : null}
      </Head>
    </React.Fragment>
  );
};

export default Meta;
