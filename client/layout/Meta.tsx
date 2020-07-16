import React from 'react';
import Head from 'next/head';

interface MetaInterface {
  title?: string;
  description?: string;
}

const Meta: React.FC<MetaInterface> = ({
  title = 'SITE_DEFAULT_TITLE',
  description = 'SITE_DEFAULT_DESCRIPTION',
}) => {
  return (
    <Head>
      <meta charSet='utf-8' />
      <meta
        name='viewport'
        content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'
      />

      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='author' content='author' />
      <meta name='copyright' content={`© 2010 - ${new Date().getFullYear()} Site™`} />
      <meta name='application-name' content='Personal Website' />

      <meta
        property='og:title'
        content='Аренда оборудования для мероприятий. Тут все прокатные компании!'
      />
      <meta property='og:type' content='website' />
      <meta property='og:image' content='/site-preview.jpg' />

      {/*TODO pass trough current url*/}
      <meta property='og:url' content='url' />
      <meta
        property='og:description'
        content='Аренда оборудования для мероприятия по доступным ценам. Большой выбор новейшего и качественного оборудования. Доставим вовремя и качественно произведем монтаж. Заходите!'
      />

      <meta
        name='twitter:title'
        content='Аренда оборудования для мероприятий. Тут все прокатные компании!'
      />
      <meta name='twitter:card' content='summary' />
      <meta name='twitter:image' content='/site-preview.jpg' />
      <meta
        name='twitter:description'
        content='Аренда оборудования для мероприятия по доступным ценам. Большой выбор новейшего и качественного оборудования. Доставим вовремя и качественно произведем монтаж. Заходите!'
      />

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
