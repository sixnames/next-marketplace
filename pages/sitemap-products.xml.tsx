import { GetServerSidePropsContext } from 'next';
import * as React from 'react';
import { getDomain } from 'tldts';
import { DEFAULT_CITY, SORT_DESC } from '../config/common';
import { COL_COMPANIES, COL_PRODUCT_FACETS, COL_SHOP_PRODUCTS } from '../db/collectionNames';
import { ignoreNoImageStage } from '../db/dao/constantPipelines';
import { CompanyModel, ShopProductModel } from '../db/dbModels';
import { getDatabase } from '../db/mongodb';
import { ShopProductInterface } from '../db/uiInterfaces';

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
  const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
  const host = `${context.req.headers.host}`;
  const domain = getDomain(host, { validHosts: ['localhost'] });

  // Get site languages

  // Session company
  let company: CompanyModel | null | undefined = null;
  if (domain && process.env.DEFAULT_DOMAIN && domain !== process.env.DEFAULT_DOMAIN) {
    company = await db.collection<CompanyModel>(COL_COMPANIES).findOne({ domain });
  }

  const companyMatch = company ? { companyId: company._id } : {};
  const productOptionsAggregation = await shopProductsCollection
    .aggregate<ShopProductInterface>([
      {
        $match: {
          ...companyMatch,
          citySlug: DEFAULT_CITY,
          ...ignoreNoImageStage,
        },
      },
      {
        $group: {
          _id: '$productId',
        },
      },
      {
        $project: {
          _id: true,
        },
      },
      {
        $sort: {
          _id: SORT_DESC,
        },
      },
      {
        $lookup: {
          from: COL_PRODUCT_FACETS,
          as: 'summary',
          let: {
            productId: '$_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$productId'],
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
        $addFields: {
          summary: {
            $arrayElemAt: ['$summary', 0],
          },
        },
      },
    ])
    .toArray();

  productOptionsAggregation.forEach((shopProduct) => {
    const { summary } = shopProduct;
    if (!summary) {
      return;
    }

    initialSlugs.push(`/${summary.slug}`);
  });

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
