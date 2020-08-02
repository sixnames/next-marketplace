import React from 'react';
import Head from 'next/head';
import { useConfigContext } from '../context/configContext';
import { ASSETS_URL } from '../config';

interface MetaInterface {
  title?: string;
  description?: string;
  previewImage?: string;
}

const Meta: React.FC<MetaInterface> = ({ title, description, previewImage }) => {
  const { getSiteConfigSingleValue } = useConfigContext();

  const configTitle = getSiteConfigSingleValue('pageDefaultTitle');
  const pageTitle = title || configTitle;

  const configDescription = getSiteConfigSingleValue('pageDefaultDescription');
  const pageDescription = description || configDescription;

  const configPreviewImage = getSiteConfigSingleValue('pageDefaultPreviewImage');
  const pagePreviewImage = `${ASSETS_URL}${previewImage || configPreviewImage}?format=jpg`;

  const configSiteName = getSiteConfigSingleValue('siteName');
  const configFoundationYear = getSiteConfigSingleValue('siteFoundationYear');

  return (
    <Head>
      <meta charSet='utf-8' />
      <meta
        name='viewport'
        content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'
      />

      <title>{pageTitle}</title>
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

      {/*TODO pass trough current url*/}
      <meta property='og:url' content='url' />
      <meta property='og:description' content={pageDescription} />

      <meta name='twitter:title' content={title} />
      <meta name='twitter:card' content='summary' />
      <meta name='twitter:image' content={pagePreviewImage} />
      <meta name='twitter:description' content={pageDescription} />

      <link rel='apple-touch-icon' sizes='180x180' href={'/apple-touch-icon.png'} />
      <link rel='icon' type='image/png' sizes='32x32' href={'/favicon-32x32.png'} />
      <link rel='icon' type='image/png' sizes='16x16' href={'/favicon-16x16.png'} />
      <link rel='icon' type='image/x-icon' className='js-site-favicon' href={'/favicon.ico'} />

      <link rel='manifest' href={'/site.webmanifest'} />
      <link rel='mask-icon' href={'/safari-pinned-tab.svg'} color='#ec482f' />
      <meta name='msapplication-TileColor' content='#ffffff' />
      <meta name='theme-color' content='#ffffff' />
    </Head>
  );
};

export default Meta;
