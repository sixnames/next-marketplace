import { GetServerSidePropsContext } from 'next';
import * as React from 'react';
import { getDomain } from 'tldts';
import {
  CATALOGUE_PRODUCTS_LIMIT,
  DEFAULT_CITY,
  DEFAULT_COMPANY_SLUG,
  DEFAULT_CURRENCY,
  DEFAULT_LOCALE,
  FILTER_CATEGORY_KEY,
  FILTER_SEPARATOR,
  ROUTE_CATALOGUE,
} from '../config/common';
import { COL_COMPANIES, COL_CONFIGS, COL_RUBRICS } from '../db/collectionNames';
import { CompanyModel, ConfigModel, RubricModel } from '../db/dbModels';
import { getDatabase } from '../db/mongodb';
import { getCatalogueData } from '../lib/catalogueUtils';
import {
  castConfigs,
  getConfigBooleanValue,
  getConfigListValue,
  getConfigNumberValue,
} from '../lib/configsUtils';
import { getCatalogueAllSeoContents } from '../lib/seoContentUtils';

const SitemapXml: React.FC = () => {
  return <div />;
};

interface CreateSitemapInterface {
  host: string;
  slugs: string[];
}

const createSitemap = ({
  host,
  slugs,
}: CreateSitemapInterface) => `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${slugs
          .map((slug) => {
            return `
                    <url>
                        <loc>https://${host}${slug}</loc>
                    </url>
                `;
          })
          .join('')}
    </urlset>
    `;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { res, req } = context;
  const initialSlugs: string[] = [];
  const { db } = await getDatabase();
  const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);
  const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
  const configsCollection = db.collection<ConfigModel>(COL_CONFIGS);
  const host = `${context.req.headers.host}`;
  const domain = getDomain(host, { validHosts: ['localhost'] });
  const locale = DEFAULT_LOCALE;
  const citySlug = DEFAULT_CITY;

  // Session company
  let company: CompanyModel | null | undefined = null;
  if (domain && process.env.DEFAULT_DOMAIN && domain !== process.env.DEFAULT_DOMAIN) {
    company = await companiesCollection.findOne({ domain });
  }
  const companySlug = company?.slug || DEFAULT_COMPANY_SLUG;

  // get configs
  const initialConfigs = await configsCollection
    .find({
      companySlug,
    })
    .toArray();
  const configs = castConfigs({
    configs: initialConfigs,
    locale,
    citySlug,
  });
  const visibleCategoriesInNavDropdown = getConfigListValue({
    configs,
    slug: 'visibleCategoriesInNavDropdown',
  });
  const catalogueProductsCount =
    getConfigNumberValue({
      configs,
      slug: 'catalogueProductsCount',
    }) || CATALOGUE_PRODUCTS_LIMIT;
  const useNoIndexRules = getConfigBooleanValue({
    configs,
    slug: 'useNoIndexRules',
  });

  // get rubrics
  const rubrics = await rubricsCollection.find({}).toArray();
  for await (const rubric of rubrics) {
    const rubricSlug = rubric.slug;
    const basePath = `${ROUTE_CATALOGUE}/${rubricSlug}`;
    const catalogueData = await getCatalogueData({
      locale,
      citySlug,
      companySlug,
      companyId: company?._id,
      currency: DEFAULT_CURRENCY,
      basePath,
      snippetVisibleAttributesCount: 0,
      visibleCategoriesInNavDropdown: visibleCategoriesInNavDropdown,
      limit: catalogueProductsCount,
      input: {
        rubricSlug: `${rubricSlug}`,
        filters: [],
        page: 1,
      },
    });
    if (!catalogueData || catalogueData.products.length < 1) {
      continue;
    }
    initialSlugs.push(basePath);

    // categories
    for await (const category of catalogueData.headCategories || []) {
      const filter = `${FILTER_CATEGORY_KEY}${FILTER_SEPARATOR}${category.slug}`;
      if (useNoIndexRules) {
        const seoContentParams = await getCatalogueAllSeoContents({
          rubricSlug: rubric.slug,
          citySlug,
          companySlug,
          filters: [filter],
          locale,
        });
        if (!seoContentParams?.seoContentTop?.showForIndex) {
          continue;
        }
      }
      initialSlugs.push(`${basePath}/${filter}`);
    }

    // attributes
    for await (const attribute of catalogueData.attributes || []) {
      if (!attribute.showAsLinkInFilter) {
        continue;
      }
      for await (const option of attribute.options || []) {
        const filter = `${attribute.slug}${FILTER_SEPARATOR}${option.slug}`;
        if (useNoIndexRules) {
          const seoContentParams = await getCatalogueAllSeoContents({
            rubricSlug: rubric.slug,
            citySlug,
            companySlug,
            filters: [filter],
            locale,
          });
          if (!seoContentParams?.seoContentTop?.showForIndex) {
            continue;
          }
        }
        initialSlugs.push(`${basePath}/${filter}`);
      }
    }
  }

  res.setHeader('Content-Type', 'text/xml');
  res.write(
    createSitemap({
      host: `${req.headers.host}`,
      slugs: initialSlugs,
    }),
  );
  res.end();
  return {
    props: {},
  };
}

export default SitemapXml;
