import {
  CATALOGUE_CATEGORY_KEY,
  FILTER_SEPARATOR,
  CATEGORY_SLUG_PREFIX_SEPARATOR,
  CATEGORY_SLUG_PREFIX_WORD,
} from 'config/common';
import { COL_COMPANIES, COL_LANGUAGES, COL_RUBRICS, COL_SHOP_PRODUCTS } from 'db/collectionNames';
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
  productSlugs: string[];
  selectedOptionsSlugs: string[];
  rubric: {
    slug: string;
  };
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

  const companyRubricsMatch = company ? { companyId: company._id } : {};
  const productOptionsAggregation = await shopProductsCollection
    .aggregate<SlugsAggregationInterface>([
      {
        $match: {
          ...companyRubricsMatch,
        },
      },
      {
        $unwind: '$selectedOptionsSlugs',
      },
      {
        $group: {
          _id: '$rubricId',
          productSlugs: {
            $addToSet: '$slug',
          },
          selectedOptionsSlugs: {
            $addToSet: '$selectedOptionsSlugs',
          },
        },
      },
      {
        $lookup: {
          from: COL_RUBRICS,
          as: 'rubrics',
          let: { rubricId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$$rubricId', '$_id'],
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
          rubric: {
            $arrayElemAt: ['$rubrics', 0],
          },
        },
      },
      {
        $project: {
          rubrics: false,
        },
      },
    ])
    .toArray();

  productOptionsAggregation.forEach((template) => {
    const { rubric, productSlugs, selectedOptionsSlugs } = template;

    // rubric
    initialSlugs.push(`catalogue/${rubric.slug}`);

    // catalogue filters
    selectedOptionsSlugs.forEach((slug) => {
      const slugParts = slug.split(CATEGORY_SLUG_PREFIX_SEPARATOR);
      const isCategory = slugParts[0] === CATEGORY_SLUG_PREFIX_WORD;

      initialSlugs.push(
        `catalogue/${rubric.slug}/${
          isCategory ? `${CATALOGUE_CATEGORY_KEY}${FILTER_SEPARATOR}${slug}` : slug
        }`,
      );
    });

    // products
    productSlugs.forEach((slug) => {
      initialSlugs.push(`/catalogue/${rubric.slug}/product/${slug}`);
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
