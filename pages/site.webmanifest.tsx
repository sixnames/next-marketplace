import { DEFAULT_COMPANY_SLUG, DEFAULT_CITY, DEFAULT_LOCALE, SORT_ASC } from 'config/common';
import { COL_COMPANIES, COL_CONFIGS } from 'db/collectionNames';
import { CompanyModel, ConfigModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { getCityFieldLocaleString } from 'lib/i18n';
import { GetServerSidePropsContext } from 'next';
import * as React from 'react';
import { getDomain } from 'tldts';

const SiteWebmanifest: React.FC = () => {
  return <div />;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { db } = await getDatabase();
  const { locale, res } = context;
  const host = `${context.req.headers.host}`;
  const domain = getDomain(host, { validHosts: ['localhost'] });
  const sessionLocale = locale || DEFAULT_LOCALE;

  // Session company
  let company: CompanyModel | null | undefined = null;
  if (domain && process.env.DEFAULT_DOMAIN && domain !== process.env.DEFAULT_DOMAIN) {
    const { db } = await getDatabase();
    company = await db.collection<CompanyModel>(COL_COMPANIES).findOne({ domain });
  }
  const companySlug = company ? company.slug : DEFAULT_COMPANY_SLUG;

  // configs
  const configsCollection = db.collection<ConfigModel>(COL_CONFIGS);
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
            "type": "image/png"
        },
        {
            "src": "${android512}",
            "sizes": "512x512",
            "type": "image/png"
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
