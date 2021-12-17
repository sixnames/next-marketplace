import {
  DEFAULT_COMPANY_SLUG,
  DEFAULT_LOCALE,
  PAGE_STATE_PUBLISHED,
  ROUTE_BLOG_POST,
  ROUTE_BLOG_WITH_PAGE,
  ROUTE_CATALOGUE,
} from 'config/common';
import {
  COL_BLOG_POSTS,
  COL_CITIES,
  COL_COMPANIES,
  COL_CONFIGS,
  COL_PRODUCTS,
  COL_SHOP_PRODUCTS,
} from 'db/collectionNames';
import { ignoreNoImageStage } from 'db/dao/constantPipelines';
import { BlogPostModel, CityModel, CompanyModel, ConfigModel, ShopProductModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { castConfigs, getConfigBooleanValue } from 'lib/configsUtils';
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

const createSitemap = ({
  host,
  slugs,
}: CreateSitemapInterface) => `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${slugs
          .map((slug) => {
            return `
                    <url>
                        <loc>https://${host}/${slug}</loc>
                    </url>
                `;
          })
          .join('')}
    </urlset>
    `;

interface SlugsAggregationInterface {
  _id: string;
  productSlugs: string[];
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { res, req } = context;
  const slugsWithLocales: string[] = [];
  const initialSlugs: string[] = [];
  const { db } = await getDatabase();
  const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
  const citiesCollection = db.collection<CityModel>(COL_CITIES);
  const configsCollection = db.collection<ConfigModel>(COL_CONFIGS);
  const blogPostsCollection = db.collection<BlogPostModel>(COL_BLOG_POSTS);
  const host = `${context.req.headers.host}`;
  const domain = getDomain(host, { validHosts: ['localhost'] });

  // Get site languages

  // Session company
  let company: CompanyModel | null | undefined = null;
  if (domain && process.env.DEFAULT_DOMAIN && domain !== process.env.DEFAULT_DOMAIN) {
    company = await db.collection<CompanyModel>(COL_COMPANIES).findOne({ domain });
  }
  const companySlug = company?.slug || DEFAULT_COMPANY_SLUG;
  const cities = await citiesCollection.find({}).toArray();

  // blog config
  const initialConfigs = await configsCollection
    .find({
      companySlug,
    })
    .toArray();

  for await (const city of cities) {
    const urlPrefix = `${companySlug}/${city.slug}`;

    const companyRubricsMatch = company ? { companyId: company._id } : {};
    const productOptionsAggregation = await shopProductsCollection
      .aggregate<SlugsAggregationInterface>([
        {
          $match: {
            ...companyRubricsMatch,
            ...ignoreNoImageStage,
          },
        },
        {
          $group: {
            _id: '$rubricSlug',
            productIds: {
              $addToSet: '$productId',
            },
          },
        },
        {
          $lookup: {
            from: COL_PRODUCTS,
            as: 'products',
            let: {
              productIds: '$productIds',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $in: ['$_id', '$$productIds'],
                  },
                },
              },
              {
                $project: {
                  slug: true,
                },
              },
            ],
          },
        },
        {
          $unwind: {
            path: '$products',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: '$_id',
            productSlugs: {
              $addToSet: '$products.slug',
            },
          },
        },
      ])
      .toArray();

    productOptionsAggregation.forEach((template) => {
      const { _id, productSlugs } = template;

      // rubric
      initialSlugs.push(`${urlPrefix}${ROUTE_CATALOGUE}/${_id}`);

      // products
      productSlugs.forEach((slug) => {
        initialSlugs.push(`${urlPrefix}/${slug}`);
      });
    });

    const blogPosts = await blogPostsCollection
      .aggregate([
        {
          $match: {
            companySlug,
            state: PAGE_STATE_PUBLISHED,
          },
        },
        {
          $project: {
            slug: true,
          },
        },
      ])
      .toArray();

    // configs
    const configs = castConfigs({
      configs: initialConfigs,
      citySlug: city.slug,
      locale: DEFAULT_LOCALE,
    });

    // get blog slugs
    const showBlog = getConfigBooleanValue({ configs, slug: 'showBlog' });
    if (showBlog && blogPosts.length > 0) {
      const blogBasePath = `${urlPrefix}${ROUTE_BLOG_WITH_PAGE}`;
      slugsWithLocales.push(blogBasePath);

      blogPosts.forEach(({ slug }) => {
        slugsWithLocales.push(`${urlPrefix}${ROUTE_BLOG_POST}/${slug}`);
      });
    }

    // get catalogue slugs
    initialSlugs.forEach((slug) => {
      slugsWithLocales.push(slug);
    });
  }

  res.setHeader('Content-Type', 'text/xml');
  res.write(
    createSitemap({
      host: `${req.headers.host}`,
      slugs: slugsWithLocales,
    }),
  );
  res.end();
  return {
    props: {},
  };
}

export default SitemapXml;
