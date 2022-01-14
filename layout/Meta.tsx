import { useRouter } from 'next/router';
import * as React from 'react';
import Head from 'next/head';
import parse from 'html-react-parser';
import { ROUTE_CMS, ROUTE_CONSOLE } from '../config/common';
import { useConfigContext } from '../context/configContext';
import { alwaysArray } from '../lib/arrayUtils';
import { getFilterUrlValues } from '../lib/getFilterUrlValues';

export interface MetaInterface {
  title?: string;
  description?: string;
  previewImage?: string;
  siteName?: string;
  foundationYear?: string;
  showForIndex: boolean;
  noIndexFollow?: boolean;
  seoSchema?: string;
}

const Meta: React.FC<MetaInterface> = ({
  title,
  description,
  siteName,
  foundationYear,
  previewImage,
  showForIndex,
  noIndexFollow,
  seoSchema,
}) => {
  const router = useRouter();
  const [canonicalUrl, setCanonicalUrl] = React.useState<string>('');
  const [showCanonical, setShowCanonical] = React.useState<boolean>(false);
  const { configs } = useConfigContext();
  const { sortBy } = getFilterUrlValues({
    initialPage: 1,
    initialLimit: 1,
    filters: alwaysArray(router.query.filters),
  });

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

  const useNoIndexConfig = configs.useNoIndexRules;
  const noIndex = !showForIndex && useNoIndexConfig;

  // Icons
  const appleTouchIcon = configs.appleTouchIcon;
  const faviconIco = configs.faviconIco;
  const iconSvg = configs.iconSvg;

  React.useEffect(() => {
    const href = window.location.href;
    setCanonicalUrl(href);
    setShowCanonical(false);
  }, [router]);

  // Metrics
  const yaVerification = configs.yaVerification;

  return (
    <React.Fragment>
      <Head>
        {/*theme*/}
        <meta name={'color-scheme'} content={'light dark'} />
        <meta name='theme-color' content='#ffffff' />
        <meta
          name='viewport'
          content={`minimum-scale=1, height=device-height, width=device-width, initial-scale=1.0`}
        />

        {/*seo index*/}
        {(noIndex && !noIndexFollow) || sortBy ? (
          <meta name='robots' content='noindex, nofollow' />
        ) : null}
        {noIndexFollow ? <meta name='robots' content='noindex, follow' /> : null}

        {/*canonical*/}
        {showCanonical ? <link rel='canonical' href={canonicalUrl} /> : null}

        {/*title & description*/}
        <title>{pageTitle}</title>
        <meta name={'description'} content={pageDescription} />

        {/*app info*/}
        <meta name='author' content={pageSiteName} />
        <meta
          name='copyright'
          content={`© ${pageFoundationYear} - ${new Date().getFullYear()} ${pageSiteName}™`}
        />
        <meta name='application-name' content='Personal Website' />

        {/*socials*/}
        <meta property='og:title' content={`${pageTitle}`} />
        <meta property='og:type' content='website' />
        <meta property='og:image' content={`${pagePreviewImage}?format=png`} />
        <meta property='og:url' content={canonicalUrl} />
        <meta property='og:description' content={pageDescription} />

        <meta name='twitter:title' content={`${pageTitle}`} />
        <meta name='twitter:card' content='summary' />
        <meta name='twitter:image' content={`${pagePreviewImage}?format=png`} />
        <meta name='twitter:description' content={pageDescription} />

        <link rel='icon' href={`${faviconIco}`} />
        <link rel='icon' href={`${iconSvg}`} type={'image/svg+xml'} />
        <link rel={'apple-touch-icon'} href={`${appleTouchIcon}?format=png`} />
        <link rel={'manifest'} href={'/site.webmanifest'} />

        {/*fonts*/}
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

        {/* Seo schema */}
        {seoSchema
          ? parse(seoSchema, {
              trim: true,
            })
          : null}

        {/*chat*/}
        {configs.chat &&
        !router.asPath.includes(ROUTE_CMS) &&
        !router.asPath.includes(ROUTE_CONSOLE) ? (
          <script src={configs.chat} async />
        ) : null}
      </Head>
    </React.Fragment>
  );
};

export default Meta;
