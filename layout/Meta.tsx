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
}

const Meta: React.FC<MetaInterface> = ({ title, description, pageUrls, previewImage }) => {
  const { getSiteConfigSingleValue } = useConfigContext();

  const configTitle = getSiteConfigSingleValue('pageDefaultTitle');
  const pageTitle = title || configTitle;

  const configDescription = getSiteConfigSingleValue('pageDefaultDescription');
  const pageDescription = description || configDescription;

  const configPreviewImage = getSiteConfigSingleValue('pageDefaultPreviewImage');
  const pagePreviewImage = previewImage || configPreviewImage;

  const configSiteName = getSiteConfigSingleValue('siteName');
  const configFoundationYear = getSiteConfigSingleValue('siteFoundationYear');

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta
        name='viewport'
        content={`minimum-scale=1, height=device-height, width=device-width, initial-scale=1.0`}
      />
      <meta name={'description'} content={pageDescription} />

      <meta name='author' content={configSiteName} />
      <meta
        name='copyright'
        content={`© ${configFoundationYear} - ${new Date().getFullYear()} Site™`}
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

      <link rel='apple-touch-icon' sizes='180x180' href={'/apple-touch-icon.png'} />
      <link rel='icon' type='image/png' sizes='32x32' href={'/favicon-32x32.png'} />
      <link rel='icon' type='image/png' sizes='16x16' href={'/favicon-16x16.png'} />
      <link rel='icon' type='image/x-icon' href={`${pageUrls.siteUrl}/favicon.ico`} />

      <link rel='apple-touch-icon' sizes='180x180' href={'/apple-touch-icon.png'} />
      <link rel='icon' type='image/png' sizes='32x32' href={'/favicon-32x32.png'} />
      <link rel='icon' type='image/png' sizes='16x16' href={'/favicon-16x16.png'} />
      <link rel='manifest' href={'/site.webmanifest'} />
      <link rel='mask-icon' href={'/safari-pinned-tab.svg'} color='#5bbad5' />
      <meta name='msapplication-TileColor' content='#ffffff' />
      <meta name='theme-color' content='#ffffff' />
      {/*<meta name='yandex-verification' content='579c17148b497788' />*/}
      <meta name='yandex-verification' content='85566b0bd87ef67d' />
    </Head>
  );
};

export default Meta;
