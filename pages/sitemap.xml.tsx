import { COL_LANGUAGES, COL_PRODUCTS, COL_RUBRICS } from 'db/collectionNames';
import { LanguageModel, ProductModel, RubricModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { GetServerSidePropsContext } from 'next';
import * as React from 'react';

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
                        <loc>${`https://${host}/${slug}`}</loc>
                    </url>
                `;
          })
          .join('')}
    </urlset>
    `;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { res, req, defaultLocale } = context;
  const slugsWithLocales: string[] = [];
  const initialSlugs: string[] = [];
  const db = await getDatabase();
  const languagesCollection = db.collection<LanguageModel>(COL_LANGUAGES);
  const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
  const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);

  const rubrics = await rubricsCollection
    .aggregate([
      {
        $match: {
          activeProductsCount: { $gt: 0 },
        },
      },
      {
        $project: {
          slug: 1,
          attributes: 1,
        },
      },
    ])
    .toArray();

  // Get initial slugs
  for await (const rubric of rubrics) {
    // rubric
    initialSlugs.push(rubric.slug);

    const productOptionsAggregation = await productsCollection
      .aggregate([
        {
          $match: {
            rubricId: rubric._id,
            active: true,
          },
        },
        {
          $project: {
            slug: 1,
            selectedOptionsSlugs: 1,
          },
        },
      ])
      .toArray();

    // product
    productOptionsAggregation.forEach(({ selectedOptionsSlugs, slug }) => {
      const productSlug = `product/rubric-${rubric.slug}/${slug}`;
      if (!initialSlugs.includes(productSlug)) {
        initialSlugs.push(productSlug);
      }

      // options
      selectedOptionsSlugs.forEach((optionSlug) => {
        const realOptionSlug = `${rubric.slug}/${optionSlug}`;

        if (!initialSlugs.includes(realOptionSlug)) {
          initialSlugs.push(realOptionSlug);
        }
      });
    });
  }

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
