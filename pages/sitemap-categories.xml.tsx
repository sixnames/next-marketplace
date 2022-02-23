import { castConfigs } from 'db/cast/castConfigs';
import { CompanyModel, ConfigModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { getCatalogueData } from 'db/ssr/catalogue/catalogueUtils';
import {
  CATALOGUE_PRODUCTS_LIMIT,
  CONFIG_GROUP_PROJECT,
  DEFAULT_CITY,
  DEFAULT_COMPANY_SLUG,
  DEFAULT_CURRENCY,
  DEFAULT_LOCALE,
  FILTER_CATEGORY_KEY,
  FILTER_SEPARATOR,
} from 'lib/config/common';
import { getConfigBooleanValue, getConfigListValue, getConfigNumberValue } from 'lib/configsUtils';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { GetServerSidePropsContext } from 'next';
import * as React from 'react';
import { getDomain } from 'tldts';

const SitemapXml: React.FC = () => {
  return <div />;
};

interface CreateSitemapInterface {
  host: string;
  slugs: string[];
}

const links = getProjectLinks();

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
  const collections = await getDbCollections();
  const companiesCollection = collections.companiesCollection();
  const rubricsCollection = collections.rubricsCollection();
  const configsCollection = collections.configsCollection();
  const seoContentsCollection = collections.seoContentsCollection();
  const host = `${req.headers.host}`;
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
  const projectConfigs = await configsCollection
    .aggregate<ConfigModel>([
      {
        $match: {
          group: CONFIG_GROUP_PROJECT,
          companySlug: DEFAULT_COMPANY_SLUG,
        },
      },
    ])
    .toArray();
  const companyConfigs = await configsCollection
    .aggregate<ConfigModel>([
      {
        $match: {
          group: {
            $ne: CONFIG_GROUP_PROJECT,
          },
          companySlug: companySlug || DEFAULT_COMPANY_SLUG,
        },
      },
    ])
    .toArray();

  const initialConfigs = [...companyConfigs, ...projectConfigs];
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
    const basePath = `${links.catalogue.url}/${rubricSlug}`;
    const catalogueData = await getCatalogueData({
      asPath: basePath,
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

    if (useNoIndexRules) {
      const seoContents = await seoContentsCollection
        .find(
          {
            companySlug,
            rubricSlug: rubric.slug,
            showForIndex: true,
            slug: {
              $regex: 'top',
              $options: 'i',
            },
          },
          {
            projection: {
              url: true,
              slug: true,
            },
          },
        )
        .toArray();

      seoContents.forEach(({ url }) => {
        const newUrl = url
          .replace(`/${companySlug}/${DEFAULT_CITY}`, '/')
          .replace(`/${DEFAULT_COMPANY_SLUG}/${DEFAULT_CITY}`, '/');
        if (!initialSlugs.includes(newUrl)) {
          initialSlugs.push(newUrl);
        }
      });

      continue;
    }

    // categories
    for await (const category of catalogueData.headCategories || []) {
      const filter = `${FILTER_CATEGORY_KEY}${FILTER_SEPARATOR}${category.slug}`;
      const asPath = `${basePath}/${filter}`;
      initialSlugs.push(asPath);
    }

    // attributes
    for await (const attribute of catalogueData.attributes || []) {
      if (!attribute.showAsLinkInFilter) {
        continue;
      }
      for await (const option of attribute.options || []) {
        const filter = `${attribute.slug}${FILTER_SEPARATOR}${option.slug}`;
        const asPath = `${basePath}/${filter}`;
        initialSlugs.push(asPath);
      }
    }
  }

  res.setHeader('Content-Type', 'text/xml');
  res.write(
    createSitemap({
      host,
      slugs: initialSlugs,
    }),
  );
  res.end();
  return {
    props: {},
  };
}

export default SitemapXml;
