import { GetServerSidePropsContext } from 'next';
import * as React from 'react';
import { getDomain } from 'tldts';
import {
  DEFAULT_CITY,
  DEFAULT_COMPANY_SLUG,
  DEFAULT_LOCALE,
  PAGE_STATE_PUBLISHED,
  ROUTE_BLOG,
  ROUTE_BLOG_POST,
  ROUTE_CATALOGUE,
} from '../config/common';
import {
  COL_BLOG_POSTS,
  COL_COMPANIES,
  COL_CONFIGS,
  COL_PRODUCT_FACETS,
  COL_SHOP_PRODUCTS,
} from '../db/collectionNames';
import { ignoreNoImageStage } from '../db/dao/constantPipelines';
import { BlogPostModel, CompanyModel, ConfigModel, ShopProductModel } from '../db/dbModels';
import { getDatabase } from '../db/mongodb';
import { castConfigs, getConfigBooleanValue } from '../lib/configsUtils';

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

  // blog config
  const initialConfigs = await configsCollection
    .find({
      companySlug,
    })
    .toArray();

  const companyRubricsMatch = company ? { companyId: company._id } : {};
  const productOptionsAggregation = await shopProductsCollection
    .aggregate<SlugsAggregationInterface>([
      {
        $match: {
          ...companyRubricsMatch,
          citySlug: DEFAULT_CITY,
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
          from: COL_PRODUCT_FACETS,
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
    initialSlugs.push(`${ROUTE_CATALOGUE}/${_id}`);

    // products
    productSlugs.forEach((slug) => {
      initialSlugs.push(`/${slug}`);
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
    citySlug: DEFAULT_CITY,
    locale: DEFAULT_LOCALE,
  });

  // get blog slugs
  const showBlog = getConfigBooleanValue({ configs, slug: 'showBlog' });
  if (showBlog && blogPosts.length > 0) {
    const blogBasePath = `${ROUTE_BLOG}`;
    slugsWithLocales.push(blogBasePath);

    blogPosts.forEach(({ slug }) => {
      slugsWithLocales.push(`${ROUTE_BLOG_POST}/${slug}`);
    });
  }

  // get catalogue slugs
  initialSlugs.forEach((slug) => {
    slugsWithLocales.push(slug);
  });

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
