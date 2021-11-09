import { DEFAULT_COMPANY_SLUG, ROUTE_CATALOGUE } from 'config/common';
import { COL_COMPANIES, COL_LANGUAGES, COL_PRODUCTS, COL_SHOP_PRODUCTS } from 'db/collectionNames';
import { noImageStage } from 'db/dao/constantPipelines';
import { CompanyModel, LanguageModel, ShopProductModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
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
  const { res, req, defaultLocale } = context;
  const slugsWithLocales: string[] = [];
  const initialSlugs: string[] = [];
  const { db } = await getDatabase();
  const languagesCollection = db.collection<LanguageModel>(COL_LANGUAGES);
  const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
  const host = `${context.req.headers.host}`;
  const domain = getDomain(host, { validHosts: ['localhost'] });

  // Session company
  let company: CompanyModel | null | undefined = null;
  if (domain && process.env.DEFAULT_DOMAIN && domain !== process.env.DEFAULT_DOMAIN) {
    const { db } = await getDatabase();
    company = await db.collection<CompanyModel>(COL_COMPANIES).findOne({ domain });
  }

  const urlPrefix = company?.slug || DEFAULT_COMPANY_SLUG;

  const companyRubricsMatch = company ? { companyId: company._id } : {};
  const productOptionsAggregation = await shopProductsCollection
    .aggregate<SlugsAggregationInterface>([
      {
        $match: {
          ...companyRubricsMatch,
          ...noImageStage,
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
      console.log(slug);
      initialSlugs.push(`${urlPrefix}/${slug}`);
    });
  });

  // Get site languages
  const languages = await languagesCollection.find({}).toArray();
  const locales = languages.map(({ slug }) => slug);

  // Get slugs with locales
  if (locales.length > 1) {
    locales.forEach((locale) => {
      initialSlugs.forEach((slug) => {
        if (locale === `${defaultLocale}`) {
          slugsWithLocales.push(slug);
        } else {
          slugsWithLocales.push(`${locale}/${slug}`);
        }
      });
    });
  } else {
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
