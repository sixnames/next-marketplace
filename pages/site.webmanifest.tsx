import { GetServerSidePropsContext } from 'next';
import * as React from 'react';
import { getDomain } from 'tldts';
import { CompanyModel } from '../db/dbModels';
import { getDbCollections } from '../db/mongodb';
import { DEFAULT_CITY, DEFAULT_COMPANY_SLUG, DEFAULT_LOCALE, SORT_ASC } from '../lib/config/common';
import { getCityFieldLocaleString } from '../lib/i18n';

const SiteWebmanifest: React.FC = () => {
  return <div />;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const collections = await getDbCollections();
  const { locale, res } = context;
  const host = `${context.req.headers.host}`;
  const domain = getDomain(host, { validHosts: ['localhost'] });
  const sessionLocale = locale || DEFAULT_LOCALE;

  // Session company
  let company: CompanyModel | null | undefined = null;
  if (domain && process.env.DEFAULT_DOMAIN && domain !== process.env.DEFAULT_DOMAIN) {
    const collections = await getDbCollections();
    company = await collections.companiesCollection().findOne({ domain });
  }
  const companySlug = company ? company.slug : DEFAULT_COMPANY_SLUG;

  // configs
  const configsCollection = collections.configsCollection();
  const initialConfigs = await configsCollection
    .find({ companySlug }, { sort: { _id: SORT_ASC } })
    .toArray();
  const configs = initialConfigs.map((config) => {
    return {
      ...config,
      singleValue: getCityFieldLocaleString({
        cityField: config.cities,
        citySlug: DEFAULT_CITY,
        locale: sessionLocale,
      })[0],
    };
  });

  const siteName = configs.find(({ slug }) => slug === 'siteName')?.singleValue;
  const android192 = configs.find(({ slug }) => slug === 'android-chrome-192x192')?.singleValue;
  const android512 = configs.find(({ slug }) => slug === 'android-chrome-512x512')?.singleValue;

  res.setHeader('Content-Type', 'application/manifest+json');
  res.write(
    `{
    "name": "${siteName}",
    "short_name": "${siteName}",
    "start_url": ".",
    "icons": [
        {
            "src": "${android192}",
            "sizes": "192x192",
            "type": "image/webp"
        },
        {
            "src": "${android512}",
            "sizes": "512x512",
            "type": "image/webp"
        }
    ],
    "theme_color": "#ffffff",
    "background_color": "#ffffff",
    "display": "standalone"
}`,
  );
  res.end();
  return {
    props: {},
  };
}

export default SiteWebmanifest;
