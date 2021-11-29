import { getConstructorContentFromText, sortStringArray } from '../../../lib/stringUtils';
import { Db } from 'mongodb';
import {
  CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
  CATALOGUE_SEO_TEXT_POSITION_TOP,
  DEFAULT_CITY,
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
  COL_PRODUCTS,
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
  ProductModel,
  RubricModel,
  SeoContentModel,
  TextUniquenessApiParsedResponseModel,
  TranslationModel,
} from '../../../db/dbModels';

export interface ProductCardDescriptionModel {
  _id: ObjectIdModel;
  companySlug: string;
  productSlug: string;
  productId: ObjectIdModel;
  textI18n: TranslationModel;
}

export interface ProductSeoModel {
  _id: ObjectIdModel;
  productId: ObjectIdModel;
  companySlug: string;
  locales: TextUniquenessApiParsedResponseModel[];
}

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

// product
interface GetProductSeoContentSlugInterface {
  productId: ObjectIdModel;
  productSlug: string;
  citySlug: string;
  companySlug: string;
  db: Db;
}

async function getProductSeoContentSlug({
  companySlug,
  citySlug,
  productId,
  productSlug,
  db,
}: GetProductSeoContentSlugInterface): Promise<GetDocumentSeoContentSlugPayloadInterface | null> {
  try {
    const citiesCollection = db.collection<CityModel>(COL_CITIES);
    const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);

    // get company
    let companyId = DEFAULT_COMPANY_SLUG;
    if (companySlug !== DEFAULT_COMPANY_SLUG) {
      const company = await companiesCollection.findOne({ slug: companySlug });
      if (!company) {
        console.log('getProductSeoContentSlug Company not found');
        return null;
      }

      companyId = company._id.toHexString();
    }

    // get city
    const city = await citiesCollection.findOne({ slug: citySlug });
    if (!city) {
      console.log('getProductSeoContentSlug City not found');
      return null;
    }
    const cityId = city._id.toHexString();

    return {
      seoContentSlug: `${companyId}${cityId}${productId.toHexString()}`,
      url: `/${companySlug}/${citySlug}/${productSlug}`,
    };
  } catch (e) {
    console.log(e);
    return null;
  }
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
    const existInTree = categoriesTree.find(({ _id }) => {
      return _id.equals(category._id);
    });
    if (!existInTree) {
      categoriesTree.push(category);
    }
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
    const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);

    // old collections
    const productCardDescriptionsCollection =
      db.collection<ProductCardDescriptionModel>('productCardDescriptions');
    const productSeoCollection = db.collection<ProductSeoModel>('productSeo');

    const rubricDescriptionsCollection =
      db.collection<RubricDescriptionModel>('rubricDescriptions');
    const categoryDescriptionsCollection =
      db.collection<CategoryDescriptionModel>('categoryDescriptions');

    const products = await productsCollection.find({}).toArray();
    const categories = await categoriesCollection.find({}).toArray();
    const rubrics = await rubricsCollection.find({}).toArray();
    const companies = await companiesCollection.find({}).toArray();

    const initialCompanySlugs = companies.map(({ slug }) => slug);
    const companySlugs = [...initialCompanySlugs, DEFAULT_COMPANY_SLUG];
    const citySlug = DEFAULT_CITY;
    const positions: DescriptionPositionType[] = [
      CATALOGUE_SEO_TEXT_POSITION_TOP,
      CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
    ];

    // delete all
    await seoContentsCollection.deleteMany({});

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
          }
        }
      }

      console.log('>> Products <<', products.length);
      for await (const product of products) {
        const seoSlugPayload = await getProductSeoContentSlug({
          db,
          companySlug,
          citySlug,
          productId: product._id,
          productSlug: product.slug,
        });
        if (seoSlugPayload) {
          const productSeo = await productSeoCollection.findOne({
            productId: product._id,
            companySlug,
          });
          const cardDescription = await productCardDescriptionsCollection.findOne({
            productId: product._id,
            companySlug,
          });
          if (!cardDescription || !cardDescription.textI18n.ru) {
            continue;
          }

          const seoLocales = productSeo?.locales || [];
          const initialText = cardDescription.textI18n.ru;
          const text = initialText.replace(/['"{}\n“]+/g, '');
          const content = getConstructorContentFromText(text);

          // insert seo content
          const seoContent = {
            slug: seoSlugPayload.seoContentSlug,
            url: seoSlugPayload.url,
            content,
            seoLocales,
            rubricSlug: product.rubricSlug,
            companySlug,
          };
          await seoContentsCollection.insertOne(seoContent);
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
