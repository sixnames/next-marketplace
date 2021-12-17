import { useSiteContext } from 'context/siteContext';
import { useRouter } from 'next/router';
import * as React from 'react';
import Head from 'next/head';
import { useConfigContext } from 'context/configContext';
import parse from 'html-react-parser';

export interface MetaInterface {
  title?: string;
  description?: string;
  previewImage?: string;
  siteName?: string;
  foundationYear?: string;
  showForIndex: boolean;
  noIndexFollow?: boolean;
}

const Meta: React.FC<MetaInterface> = ({
  title,
  description,
  siteName,
  foundationYear,
  previewImage,
  showForIndex,
  noIndexFollow,
}) => {
  const router = useRouter();
  const [canonicalUrl, setCanonicalUrl] = React.useState<string>('');
  const [showCanonical, setShowCanonical] = React.useState<boolean>(false);
  const { configs } = useConfigContext();
  const { urlPrefix } = useSiteContext();

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
    if (router.asPath === urlPrefix) {
      setCanonicalUrl(href.replace(urlPrefix, ''));
      setShowCanonical(true);
      return;
    }

    setCanonicalUrl(href);
    setShowCanonical(false);
  }, [urlPrefix, router]);

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
        {noIndex && !noIndexFollow ? <meta name='robots' content='noindex, nofollow' /> : null}
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
      </Head>
    </React.Fragment>
  );
};

export default Meta;
