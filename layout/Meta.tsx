import * as React from 'react';
import Head from 'next/head';
import { useConfigContext } from 'context/configContext';
import parse from 'html-react-parser';

export interface PageUrlsInterface {
  canonicalUrl: string;
  siteUrl: string;
  domain: string;
}

export interface MetaInterface {
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
  const { configs } = useConfigContext();

  const configTitle = configs.pageDefaultTitle;
  const pageTitle = title || configTitle;

  const configDescription = configs.pageDefaultDescription;
  const pageDescription = description || configDescription;

  const configPreviewImage = configs.pageDefaultPreviewImage;
  const pagePreviewImage = previewImage || configPreviewImage;

  const configSiteName = configs.siteName;
  const pageSiteName = siteName || configSiteName;

  const configFoundationYear = configs.siteFoundationYear;
  const pageFoundationYear = foundationYear || configFoundationYear;

  // Icons
  const appleTouchIcon = configs.appleTouchIcon;
  const faviconIco = configs.faviconIco;
  const iconSvg = configs.iconSvg;

  // Metrics
  //<!-- Yandex.Metrika counter --> <!-- /Yandex.Metrika counter -->
  //<!-- Global site tag (gtag.js) - Google Analytics -->
  const yaVerification = configs.yaVerification;
  // const yaMetrica = getSiteConfigSingleValue('yaMetrica') || '';
  // const googleAnalytics = getSiteConfigSingleValue('googleAnalytics') || '';
  // const metricsCodeAsString = `${yaVerification}${yaMetrica}${googleAnalytics}`;

  return (
    <React.Fragment>
      <Head>
        {'<!-- Yandex.Metrika counter --> <!-- /Yandex.Metrika counter -->'}
        <title>{pageTitle}</title>
        <meta name={'color-scheme'} content={'light dark'} />
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

        <meta property='og:title' content={`${pageTitle}`} />
        <meta property='og:type' content='website' />
        <meta property='og:image' content={pagePreviewImage} />
        <meta property='og:url' content={pageUrls.canonicalUrl} />
        <meta property='og:description' content={pageDescription} />

        <meta name='twitter:title' content={`${pageTitle}`} />
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
