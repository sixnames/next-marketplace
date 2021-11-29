import { sortStringArray } from '../../../lib/stringUtils';
import { Db } from 'mongodb';
import {
  CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
  CATALOGUE_SEO_TEXT_POSITION_TOP,
  DEFAULT_COMPANY_SLUG,
  FILTER_CATEGORY_KEY,
  FILTER_SEPARATOR,
  ID_COUNTER_STEP,
  PAGE_EDITOR_DEFAULT_VALUE_STRING,
  ROUTE_CATALOGUE,
} from '../../../config/common';
import { dbsConfig, getProdDb } from './getProdDb';
import {
  COL_CATEGORIES,
  COL_CITIES,
  COL_COMPANIES,
  COL_ID_COUNTERS,
  COL_RUBRICS,
  COL_SEO_CONTENTS,
} from '../../../db/collectionNames';
import {
  CategoryModel,
  CityModel,
  CompanyModel,
  DescriptionPositionType,
  IdCounterModel,
  JSONObjectModel,
  ObjectIdModel,
  RubricModel,
  SeoContentModel,
} from '../../../db/dbModels';

export interface RubricDescriptionModel {
  _id: ObjectIdModel;
  companySlug: string;
  rubricSlug: string;
  position: DescriptionPositionType;
  rubricId: ObjectIdModel;
  content: JSONObjectModel;
  assetKeys: string[];
}

export interface CategoryDescriptionModel {
  _id: ObjectIdModel;
  companySlug: string;
  categoryId: ObjectIdModel;
  categorySlug: string;
  position: DescriptionPositionType;
  content: JSONObjectModel;
  assetKeys: string[];
}

require('dotenv').config();

export async function getFastNextNumberItemId(collectionName: string, db: Db): Promise<string> {
  const idCountersCollection = db.collection<IdCounterModel>(COL_ID_COUNTERS);

  const updatedCounter = await idCountersCollection.findOneAndUpdate(
    { collection: collectionName },
    {
      $inc: {
        counter: ID_COUNTER_STEP,
      },
    },
    {
      upsert: true,
      returnDocument: 'after',
    },
  );

  if (!updatedCounter.ok || !updatedCounter.value) {
    throw Error(`${collectionName} id counter update error`);
  }

  return `${updatedCounter.value.counter}`;
}

interface CastCatalogueFilterPayloadInterface {
  attributeSlug: string;
  optionSlug: string;
}

function castCatalogueFilter(filter: string): CastCatalogueFilterPayloadInterface {
  const splittedOption = filter.split(FILTER_SEPARATOR);

  return {
    attributeSlug: `${splittedOption[0]}`,
    optionSlug: splittedOption[1],
  };
}

// document seo text slugs
interface GetDocumentSeoContentSlugPayloadInterface {
  seoContentSlug: string;
  url: string;
}

interface GetCategorySeoContentSlugInterface {
  categoryId: ObjectIdModel;
  citySlug: string;
  companySlug: string;
  position: DescriptionPositionType;
  db: Db;
}

async function getCategorySeoContentSlug({
  companySlug,
  citySlug,
  categoryId,
  position,
  db,
}: GetCategorySeoContentSlugInterface): Promise<GetDocumentSeoContentSlugPayloadInterface | null> {
  try {
    const citiesCollection = db.collection<CityModel>(COL_CITIES);
    const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);
    const categoriesCollection = db.collection<CategoryModel>(COL_CATEGORIES);
    const category = await categoriesCollection.findOne({
      _id: categoryId,
    });
    if (!category) {
      return null;
    }
    const categoriesTree = await categoriesCollection
      .find({
        _id: {
          $in: category.parentTreeIds,
        },
      })
      .toArray();
    const filters = categoriesTree.map(({ slug }) => {
      return `${FILTER_CATEGORY_KEY}${FILTER_SEPARATOR}${slug}`;
    });
    const sortedFilters = sortStringArray(filters);
    const categoryIds = sortedFilters.reduce((acc: string, filter) => {
      const { optionSlug } = castCatalogueFilter(filter);
      const slugCategory = categoriesTree.find(({ slug }) => {
        return slug === optionSlug;
      });
      if (slugCategory) {
        return `${acc}${slugCategory._id.toHexString()}`;
      }
      return acc;
    }, '');

    // get company
    let companyId = DEFAULT_COMPANY_SLUG;
    if (companySlug !== DEFAULT_COMPANY_SLUG) {
      const company = await companiesCollection.findOne({ slug: companySlug });
      if (!company) {
        console.log('getCategorySeoContentSlug Company not found');
        return null;
      }

      companyId = company._id.toHexString();
    }

    // get city
    const city = await citiesCollection.findOne({ slug: citySlug });
    if (!city) {
      console.log('getCategorySeoContentSlug City not found');
      return null;
    }
    const cityId = city._id.toHexString();

    return {
      seoContentSlug: `${companyId}${cityId}${category.rubricId.toHexString()}${categoryIds}${position}`,
      url: `/${companySlug}/${citySlug}${ROUTE_CATALOGUE}/${
        category.rubricSlug
      }/${sortedFilters.join('/')}`,
    };
  } catch (e) {
    console.log(e);
    return null;
  }
}

interface GetRubricSeoContentSlugInterface {
  rubricId: ObjectIdModel;
  rubricSlug: string;
  citySlug: string;
  companySlug: string;
  position: DescriptionPositionType;
  db: Db;
}

async function getRubricSeoContentSlug({
  companySlug,
  citySlug,
  rubricId,
  rubricSlug,
  position,
  db,
}: GetRubricSeoContentSlugInterface): Promise<GetDocumentSeoContentSlugPayloadInterface | null> {
  try {
    const citiesCollection = db.collection<CityModel>(COL_CITIES);
    const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);

    // get company
    let companyId = DEFAULT_COMPANY_SLUG;
    if (companySlug !== DEFAULT_COMPANY_SLUG) {
      const company = await companiesCollection.findOne({ slug: companySlug });
      if (!company) {
        console.log('getRubricSeoContentSlug Company not found');
        return null;
      }

      companyId = company._id.toHexString();
    }

    // get city
    const city = await citiesCollection.findOne({ slug: citySlug });
    if (!city) {
      console.log('getRubricSeoContentSlug City not found');
      return null;
    }
    const cityId = city._id.toHexString();

    return {
      seoContentSlug: `${companyId}${cityId}${rubricId.toHexString()}${position}`,
      url: `/${companySlug}/${citySlug}${ROUTE_CATALOGUE}/${rubricSlug}`,
    };
  } catch (e) {
    console.log(e);
    return null;
  }
}

async function updateProds() {
  for await (const dbConfig of dbsConfig) {
    console.log(' ');
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log(' ');
    console.log(`Updating ${dbConfig.dbName} db`);
    const { db, client } = await getProdDb(dbConfig);
    const seoContentsCollection = db.collection<SeoContentModel>(COL_SEO_CONTENTS);
    const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
    const categoriesCollection = db.collection<CategoryModel>(COL_CATEGORIES);
    const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);

    // old collections
    const rubricDescriptionsCollection =
      db.collection<RubricDescriptionModel>('rubricDescriptions');
    const categoryDescriptionsCollection =
      db.collection<CategoryDescriptionModel>('categoryDescriptions');

    const categories = await categoriesCollection.find({}).toArray();
    const rubrics = await rubricsCollection.find({}).toArray();
    const companies = await companiesCollection.find({}).toArray();

    const initialCompanySlugs = companies.map(({ slug }) => slug);
    const companySlugs = [...initialCompanySlugs, DEFAULT_COMPANY_SLUG];
    const positions: DescriptionPositionType[] = [
      CATALOGUE_SEO_TEXT_POSITION_TOP,
      CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
    ];

    for await (const companySlug of companySlugs) {
      console.log(companySlug, '>>>>>>');

      console.log('>> Categories <<', categories.length);
      for await (const position of positions) {
        for await (const category of categories) {
          const description = await categoryDescriptionsCollection.findOne({
            categoryId: category._id,
            companySlug,
            position,
          });
          if (!description || !description.content) {
            continue;
          }

          const contentCities = description.content;
          const citySlugs = Object.keys(contentCities);
          for await (const citySlug of citySlugs) {
            const content = contentCities[citySlug];
            if (!content || content === PAGE_EDITOR_DEFAULT_VALUE_STRING) {
              continue;
            }

            const seoSlugPayload = await getCategorySeoContentSlug({
              db,
              companySlug,
              citySlug,
              categoryId: category._id,
              position,
            });

            if (!seoSlugPayload) {
              continue;
            }

            const seoContent = await seoContentsCollection.findOne({
              slug: seoSlugPayload.seoContentSlug,
            });
            if (!seoContent) {
              // insert seo content
              const seoContent = {
                slug: seoSlugPayload.seoContentSlug,
                url: seoSlugPayload.url,
                content,
                seoLocales: [],
                rubricSlug: category.rubricSlug,
                companySlug,
              };
              await seoContentsCollection.insertOne(seoContent);
              continue;
            }
            await seoContentsCollection.findOneAndUpdate(
              {
                slug: seoSlugPayload.seoContentSlug,
              },
              {
                $set: {
                  content,
                },
              },
            );
          }
        }
      }

      console.log('>> Rubrics <<', rubrics.length);
      for await (const position of positions) {
        for await (const rubric of rubrics) {
          const description = await rubricDescriptionsCollection.findOne({
            rubricId: rubric._id,
            companySlug,
            position,
          });
          if (!description || !description.content) {
            continue;
          }

          const contentCities = description.content;
          const citySlugs = Object.keys(contentCities);
          for await (const citySlug of citySlugs) {
            const content = contentCities[citySlug];
            if (!content || content === PAGE_EDITOR_DEFAULT_VALUE_STRING) {
              continue;
            }

            const seoSlugPayload = await getRubricSeoContentSlug({
              db,
              companySlug,
              citySlug,
              rubricId: rubric._id,
              rubricSlug: rubric.slug,
              position,
            });

            if (!seoSlugPayload) {
              continue;
            }

            const seoContent = await seoContentsCollection.findOne({
              slug: seoSlugPayload.seoContentSlug,
            });
            if (!seoContent) {
              // insert seo content
              const seoContent = {
                slug: seoSlugPayload.seoContentSlug,
                url: seoSlugPayload.url,
                content,
                seoLocales: [],
                rubricSlug: rubric.slug,
                companySlug,
              };
              await seoContentsCollection.insertOne(seoContent);
              continue;
            }
            await seoContentsCollection.findOneAndUpdate(
              {
                slug: seoSlugPayload.seoContentSlug,
              },
              {
                $set: {
                  content,
                },
              },
            );
          }
        }
      }
    }

    // disconnect form db
    await client.close();
    console.log(`Done ${dbConfig.dbName}`);
    console.log(' ');
  }
}

(() => {
  updateProds()
    .then(() => {
      console.log('Success!');
      process.exit();
    })
    .catch((e) => {
      console.log(e);
      process.exit();
    });
})();
