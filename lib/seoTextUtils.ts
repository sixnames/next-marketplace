import { getTextContents, Value } from '@react-page/editor';
import { reactPageCellPlugins } from 'components/PageEditor';
import {
  CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
  CATALOGUE_SEO_TEXT_POSITION_TOP,
  DEFAULT_CITY,
  DEFAULT_COMPANY_SLUG,
  DEFAULT_LOCALE,
  FILTER_CATEGORY_KEY,
  FILTER_SEPARATOR,
  LOCALES,
  PAGE_EDITOR_DEFAULT_VALUE_STRING,
  REQUEST_METHOD_POST,
  ROUTE_CATALOGUE,
  SORT_DESC,
} from 'config/common';
import { getPriceAttribute } from 'config/constantAttributes';
import {
  COL_ATTRIBUTES,
  COL_BRAND_COLLECTIONS,
  COL_BRANDS,
  COL_CATEGORIES,
  COL_CITIES,
  COL_COMPANIES,
  COL_CONFIGS,
  COL_OPTIONS,
  COL_RUBRICS,
  COL_SEO_CONTENTS,
} from 'db/collectionNames';
import { getCitiesList } from 'db/dao/cities/getCitiesList';
import {
  AttributeModel,
  BrandCollectionModel,
  BrandModel,
  CategoryModel,
  CityModel,
  CompanyModel,
  ConfigModel,
  DescriptionPositionType,
  ObjectIdModel,
  RubricModel,
  SeoContentModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { AttributeInterface, CategoryInterface, SeoContentCitiesInterface } from 'db/uiInterfaces';
import { castCatalogueFilters } from 'lib/catalogueUtils';
import { castConfigs, getConfigStringValue } from 'lib/configsUtils';
import { castCatalogueFilter, getTreeFromList, getTreeLeaves } from 'lib/optionUtils';
import { sortStringArray } from 'lib/stringUtils';
import { sortBy } from 'lodash';
import { ObjectId } from 'mongodb';
import fetch from 'node-fetch';
import qs from 'qs';

interface CheckSeoTextUniquenessInterface {
  text?: string | null;
  oldText?: string | null;
  companySlug: string;
  seoContentId: ObjectIdModel;
}

export async function checkSeoTextUniqueness({
  text,
  oldText,
  companySlug,
  seoContentId,
}: CheckSeoTextUniquenessInterface) {
  try {
    const { db } = await getDatabase();

    // get uniqueness api key and url
    const configSlug = 'textUniquenessApiKey';
    const configsCollection = db.collection<ConfigModel>(COL_CONFIGS);
    const initialConfigs = await configsCollection
      .find({
        slug: configSlug,
        companySlug,
      })
      .toArray();
    const configs = castConfigs({
      configs: initialConfigs,
      citySlug: DEFAULT_CITY,
      locale: DEFAULT_LOCALE,
    });
    const uniqueTextApiKey = getConfigStringValue({
      configs,
      slug: configSlug,
    });
    const uniqueTextApiUrl = process.env.UNIQUE_TEXT_API_URL;

    // get domain
    let domain = process.env.DEFAULT_DOMAIN;
    if (companySlug !== DEFAULT_COMPANY_SLUG) {
      const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);
      const company = await companiesCollection.findOne({
        slug: companySlug,
      });
      domain = company?.domain || process.env.DEFAULT_DOMAIN;
    }

    if (uniqueTextApiUrl && uniqueTextApiKey && text) {
      for await (const locale of LOCALES) {
        const rawText = JSON.parse(text);
        const textContents = getTextContents(rawText as Value, {
          lang: locale,
          cellPlugins: reactPageCellPlugins(),
        }).join(' ');

        const rawOldText = oldText ? JSON.parse(oldText) : null;
        const oldTextContents = rawOldText
          ? getTextContents(rawOldText as Value, {
              lang: locale,
              cellPlugins: reactPageCellPlugins(),
            }).join(' ')
          : null;

        if (textContents !== oldTextContents) {
          const body = {
            userkey: uniqueTextApiKey,
            exceptdomain: domain,
            callback: `https://${domain}/api/seo-text/uniqueness/${seoContentId}/${locale}`,
            text,
          };

          await fetch(uniqueTextApiUrl, {
            method: REQUEST_METHOD_POST,
            body: qs.stringify(body),
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          });
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
}

interface UpdateCitiesSeoTextInterface {
  seoTextsList: SeoContentCitiesInterface;
  companySlug: string;
}

export async function updateCitiesSeoText({
  seoTextsList,
  companySlug,
}: UpdateCitiesSeoTextInterface) {
  const { db } = await getDatabase();
  const seoContentsCollection = db.collection<SeoContentModel>(COL_SEO_CONTENTS);

  const cities = await getCitiesList();
  for await (const city of cities) {
    const seoContent = seoTextsList[city.slug];

    if (seoContent) {
      const oldSeoContent = await seoContentsCollection.findOne({
        _id: new ObjectId(seoContent._id),
      });

      // check uniqueness
      await checkSeoTextUniqueness({
        companySlug,
        seoContentId: new ObjectId(seoContent._id),
        text: seoContent.content,
        oldText: oldSeoContent?.content,
      });

      // create if not exist
      if (!oldSeoContent) {
        await seoContentsCollection.insertOne(seoContent);
        continue;
      }

      // update existing
      const { _id, ...values } = seoContent;
      await seoContentsCollection.findOneAndUpdate(
        {
          _id: new ObjectId(_id),
        },
        {
          $set: values,
        },
      );
    }
  }
}

interface GetCatalogueSeoTextSlugInterface {
  filters: string[];
  rubricSlug: string;
  citySlug: string;
  companySlug: string;
}

interface GetCatalogueSeoTextSlugPayloadInterface {
  seoTextSlug: string;
  categoryLeaves: CategoryInterface[];
  noFiltersSelected: boolean;
  inCategory: boolean;
  rubricId: string;
}

interface GetCatalogueSeoTextSlugAttributeConfigInterface {
  attributeSlug: string;
  optionSlugs: string[];
}

export async function getCatalogueSeoTextSlug({
  filters,
  companySlug,
  citySlug,
  rubricSlug,
}: GetCatalogueSeoTextSlugInterface): Promise<GetCatalogueSeoTextSlugPayloadInterface | null> {
  try {
    const { db } = await getDatabase();
    const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
    const citiesCollection = db.collection<CityModel>(COL_CITIES);
    const categoriesCollection = db.collection<CategoryModel>(COL_CATEGORIES);
    const brandsCollection = db.collection<BrandModel>(COL_BRANDS);
    const brandCollectionsCollection = db.collection<BrandCollectionModel>(COL_BRAND_COLLECTIONS);
    const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);
    const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
    const {
      brandFilters,
      brandCollectionFilters,
      categoryCastedFilters,
      priceFilters,
      realFilters,
      noFiltersSelected,
      inCategory,
    } = castCatalogueFilters({
      filters,
    });

    const queryOptions = {
      sort: {
        _id: SORT_DESC,
      },
    };

    // get rubric
    const rubric = await rubricsCollection.findOne({ slug: rubricSlug });
    if (!rubric) {
      console.log('getCatalogueSeoTextSlug Rubric not found');
      return null;
    }
    const rubricId = rubric._id.toHexString();

    // get company
    let companyId = DEFAULT_COMPANY_SLUG;
    if (companySlug !== DEFAULT_COMPANY_SLUG) {
      const company = await companiesCollection.findOne({ slug: companySlug });
      if (!company) {
        console.log('getCatalogueSeoTextSlug Company not found');
        return null;
      }

      companyId = company._id.toHexString();
    }

    // get city
    const city = await citiesCollection.findOne({ slug: citySlug });
    if (!city) {
      console.log('getCatalogueSeoTextSlug City not found');
      return null;
    }
    const cityId = city._id.toHexString();

    // get categories
    const categories = await categoriesCollection
      .find(
        {
          slug: {
            $in: categoryCastedFilters,
          },
        },
        queryOptions,
      )
      .toArray();
    const sortedCategoryCastedFilters = sortStringArray(categoryCastedFilters);
    const categoryIds = sortedCategoryCastedFilters.reduce((acc: string, filter) => {
      const slugCategory = categories.find(({ slug }) => {
        return slug === filter;
      });
      if (slugCategory) {
        return `${acc}${slugCategory._id.toHexString()}`;
      }
      return acc;
    }, '');
    const childrenFieldName = 'categories';
    const categoriesTree = getTreeFromList({
      list: categories,
      childrenFieldName,
    });
    const categoryLeaves = getTreeLeaves({
      list: categoriesTree,
      childrenFieldName,
    });

    // get brands
    const brands = await brandsCollection
      .find(
        {
          itemId: {
            $in: brandFilters,
          },
        },
        queryOptions,
      )
      .toArray();
    const brandIds = sortBy(brands, ['itemId']).reduce((acc: string, { _id }) => {
      return `${acc}${_id.toHexString()}`;
    }, '');

    // get brand collections
    const brandCollections = await brandCollectionsCollection
      .find(
        {
          itemId: {
            $in: brandCollectionFilters,
          },
        },
        queryOptions,
      )
      .toArray();
    const brandCollectionIds = sortBy(brandCollections, ['itemId']).reduce(
      (acc: string, { _id }) => {
        return `${acc}${_id.toHexString()}`;
      },
      '',
    );

    // get prices
    const priceSlugs = priceFilters.map((filter) => {
      const { optionSlug } = castCatalogueFilter(filter);
      return optionSlug;
    });
    const priceAttribute = getPriceAttribute(city.currency);
    const priceOptions = (priceAttribute.options || []).filter(({ slug }) => {
      return priceSlugs.includes(slug);
    });
    const priceIds = sortBy(priceOptions, ['slug']).reduce((acc: string, { _id }) => {
      return `${acc}${_id.toHexString()}`;
    }, '');

    // get attributes
    const attributeConfigs = realFilters.reduce(
      (acc: GetCatalogueSeoTextSlugAttributeConfigInterface[], filter) => {
        if (categoryCastedFilters.includes(filter)) {
          return acc;
        }

        const newAcc = [...acc];
        const { attributeSlug, optionSlug } = castCatalogueFilter(filter);
        const existingAttributeConfigIndex = newAcc.findIndex((config) => {
          return attributeSlug === config.attributeSlug;
        });
        if (existingAttributeConfigIndex > -1) {
          newAcc[existingAttributeConfigIndex].optionSlugs.push(optionSlug);
          return newAcc;
        }

        return [
          ...acc,
          {
            attributeSlug: attributeSlug,
            optionSlugs: [optionSlug],
          },
        ];
      },
      [],
    );
    const sortedAttributeConfigs = sortBy(attributeConfigs, ['attributeSlug']);
    const attributes: AttributeInterface[] = [];
    for await (const attributeConfig of sortedAttributeConfigs) {
      const attributeAggregation = await attributesCollection
        .aggregate<AttributeInterface>([
          {
            $match: {
              slug: attributeConfig.attributeSlug,
            },
          },
          // get attribute options
          {
            $lookup: {
              from: COL_OPTIONS,
              as: 'options',
              let: {
                optionsGroupId: '$optionsGroupId',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ['$$optionsGroupId', '$optionsGroupId'],
                        },
                        {
                          $in: ['$slug', attributeConfig.optionSlugs],
                        },
                      ],
                    },
                  },
                },
                {
                  $sort: {
                    _id: SORT_DESC,
                  },
                },
              ],
            },
          },
        ])
        .toArray();
      const attribute = attributeAggregation[0];
      if (!attribute) {
        continue;
      }
      attributes.push(attribute);
    }
    const attributeIds = sortBy(attributes, ['slug']).reduce((acc: string, attribute) => {
      const attributeId = sortBy(attribute.options || [], 'slug').reduce(
        (innerAcc: string, { _id }) => {
          return `${innerAcc}${attribute._id.toHexString()}${_id.toHexString()}`;
        },
        '',
      );
      return `${acc}${attributeId}`;
    }, '');

    return {
      rubricId,
      inCategory,
      noFiltersSelected,
      categoryLeaves,
      seoTextSlug: `${companyId}${cityId}${rubricId}${categoryIds}${brandIds}${brandCollectionIds}${attributeIds}${priceIds}`,
    };
  } catch (e) {
    console.log(e);
    return null;
  }
}

interface GetCatalogueAllSeoTextsInterface extends GetCatalogueSeoTextSlugInterface {}
interface GetCatalogueAllSeoTextsPayloadInterface {
  seoTextTop?: SeoContentModel | null;
  seoTextTopSlug: string;
  seoTextBottom?: SeoContentModel | null;
  seoTextBottomSlug: string;
  editUrl: string;
  textTopEditUrl: string;
  textBottomEditUrl: string;
}

export async function getCatalogueAllSeoTexts(
  props: GetCatalogueAllSeoTextsInterface,
): Promise<GetCatalogueAllSeoTextsPayloadInterface | null> {
  const { db } = await getDatabase();
  const seoTextsCollection = db.collection<SeoContentModel>(COL_SEO_CONTENTS);
  const payload = await getCatalogueSeoTextSlug(props);

  if (!payload) {
    return null;
  }

  const { noFiltersSelected, rubricId, seoTextSlug, categoryLeaves } = payload;

  const seoTextTopSlug = `${seoTextSlug}${CATALOGUE_SEO_TEXT_POSITION_TOP}`;
  const seoTextTop = await seoTextsCollection.findOne({
    slug: seoTextTopSlug,
  });

  const seoTextBottomSlug = `${seoTextSlug}${CATALOGUE_SEO_TEXT_POSITION_BOTTOM}`;
  const seoTextBottom = await seoTextsCollection.findOne({
    slug: seoTextBottomSlug,
  });

  const baseEditUrl = `/rubrics/${rubricId}`;
  let editUrl = baseEditUrl;
  let textTopEditUrl = editUrl;
  let textBottomEditUrl = editUrl;

  if (categoryLeaves.length === 1) {
    const category = categoryLeaves[0];
    editUrl = `${baseEditUrl}/categories/${category._id}`;

    if (noFiltersSelected) {
      textTopEditUrl = editUrl;
      textBottomEditUrl = editUrl;
    }
  }

  if (!noFiltersSelected) {
    textTopEditUrl = `${baseEditUrl}/seo-texts/text/${seoTextTopSlug}`;
    textBottomEditUrl = `${baseEditUrl}/seo-texts/text/${seoTextBottomSlug}`;
  }

  return {
    editUrl,
    textTopEditUrl,
    textBottomEditUrl,
    seoTextTop,
    seoTextTopSlug,
    seoTextBottom,
    seoTextBottomSlug,
  };
}

// document seo text slugs
interface GetDocumentSeoTextSlugPayloadInterface {
  seoTextSlug: string;
  url: string;
}

// product
interface GetProductSeoTextSlugInterface {
  productId: ObjectIdModel;
  productSlug: string;
  citySlug: string;
  companySlug: string;
}

export async function getProductSeoTextSlug({
  companySlug,
  citySlug,
  productId,
  productSlug,
}: GetProductSeoTextSlugInterface): Promise<GetDocumentSeoTextSlugPayloadInterface | null> {
  try {
    const { db } = await getDatabase();
    const citiesCollection = db.collection<CityModel>(COL_CITIES);
    const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);

    // get company
    let companyId = DEFAULT_COMPANY_SLUG;
    if (companySlug !== DEFAULT_COMPANY_SLUG) {
      const company = await companiesCollection.findOne({ slug: companySlug });
      if (!company) {
        console.log('getProductSeoTextSlug Company not found');
        return null;
      }

      companyId = company._id.toHexString();
    }

    // get city
    const city = await citiesCollection.findOne({ slug: citySlug });
    if (!city) {
      console.log('getProductSeoTextSlug City not found');
      return null;
    }
    const cityId = city._id.toHexString();

    return {
      seoTextSlug: `${companyId}${cityId}${productId.toHexString()}`,
      url: `/${companySlug}/${citySlug}/${productSlug}`,
    };
  } catch (e) {
    console.log(e);
    return null;
  }
}

// rubric
interface GetRubricSeoTextSlugInterface {
  rubricId: ObjectIdModel;
  rubricSlug: string;
  citySlug: string;
  companySlug: string;
  position: DescriptionPositionType;
}

export async function getRubricSeoTextSlug({
  companySlug,
  citySlug,
  rubricId,
  rubricSlug,
  position,
}: GetRubricSeoTextSlugInterface): Promise<GetDocumentSeoTextSlugPayloadInterface | null> {
  try {
    const { db } = await getDatabase();
    const citiesCollection = db.collection<CityModel>(COL_CITIES);
    const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);

    // get company
    let companyId = DEFAULT_COMPANY_SLUG;
    if (companySlug !== DEFAULT_COMPANY_SLUG) {
      const company = await companiesCollection.findOne({ slug: companySlug });
      if (!company) {
        console.log('getProductSeoTextSlug Company not found');
        return null;
      }

      companyId = company._id.toHexString();
    }

    // get city
    const city = await citiesCollection.findOne({ slug: citySlug });
    if (!city) {
      console.log('getProductSeoTextSlug City not found');
      return null;
    }
    const cityId = city._id.toHexString();

    return {
      seoTextSlug: `${companyId}${cityId}${rubricId.toHexString()}${position}`,
      url: `/${companySlug}/${citySlug}${ROUTE_CATALOGUE}/${rubricSlug}`,
    };
  } catch (e) {
    console.log(e);
    return null;
  }
}

// category
interface GetCategorySeoTextSlugInterface {
  categoryId: ObjectIdModel;
  citySlug: string;
  companySlug: string;
  position: DescriptionPositionType;
}

export async function getCategorySeoTextSlug({
  companySlug,
  citySlug,
  categoryId,
  position,
}: GetCategorySeoTextSlugInterface): Promise<GetDocumentSeoTextSlugPayloadInterface | null> {
  try {
    const { db } = await getDatabase();
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
        console.log('getCategorySeoTextSlug Company not found');
        return null;
      }

      companyId = company._id.toHexString();
    }

    // get city
    const city = await citiesCollection.findOne({ slug: citySlug });
    if (!city) {
      console.log('getCategorySeoTextSlug City not found');
      return null;
    }
    const cityId = city._id.toHexString();

    return {
      seoTextSlug: `${companyId}${cityId}${category.rubricId.toHexString()}${categoryIds}${position}`,
      url: `/${companySlug}/${citySlug}${ROUTE_CATALOGUE}/${
        category.rubricSlug
      }/${sortedFilters.join('/')}`,
    };
  } catch (e) {
    console.log(e);
    return null;
  }
}

// rubric
interface GetRubricSeoTextInterface {
  companySlug: string;
  position: DescriptionPositionType;
  rubricSlug: string;
  rubricId: ObjectIdModel;
  citySlug: string;
}

export async function getRubricSeoText({
  companySlug,
  position,
  rubricSlug,
  rubricId,
  citySlug,
}: GetRubricSeoTextInterface): Promise<SeoContentModel | null> {
  const { db } = await getDatabase();

  const seoTextSlugPayload = await getRubricSeoTextSlug({
    rubricId,
    companySlug,
    rubricSlug,
    citySlug,
    position,
  });
  if (!seoTextSlugPayload) {
    return null;
  }

  const seoContentsCollection = db.collection<SeoContentModel>(COL_SEO_CONTENTS);
  const seoText = await seoContentsCollection.findOne({
    slug: seoTextSlugPayload.seoTextSlug,
  });

  if (!seoText) {
    const newSeoTextResult = await seoContentsCollection.insertOne({
      url: seoTextSlugPayload.url,
      slug: seoTextSlugPayload.seoTextSlug,
      content: PAGE_EDITOR_DEFAULT_VALUE_STRING,
      rubricSlug,
      companySlug,
    });
    if (!newSeoTextResult.acknowledged) {
      return null;
    }
    const newSeoText = await seoContentsCollection.findOne({
      _id: newSeoTextResult.insertedId,
    });
    return newSeoText;
  }

  return seoText;
}

interface GetRubricAllSeoTextsInterface extends Omit<GetRubricSeoTextInterface, 'citySlug'> {}
export async function getRubricAllSeoTexts({
  companySlug,
  position,
  rubricSlug,
  rubricId,
}: GetRubricAllSeoTextsInterface): Promise<SeoContentCitiesInterface> {
  const cities = await getCitiesList();
  let payload: SeoContentCitiesInterface = {};
  for await (const city of cities) {
    const seoText = await getRubricSeoText({
      companySlug,
      position,
      rubricSlug,
      rubricId,
      citySlug: city.slug,
    });
    if (seoText) {
      payload[city.slug] = seoText;
    }
  }
  return payload;
}

// category
interface GetCategorySeoTextInterface {
  companySlug: string;
  citySlug: string;
  position: DescriptionPositionType;
  categoryId: ObjectIdModel;
  rubricSlug: string;
}

export async function getCategorySeoText({
  companySlug,
  position,
  categoryId,
  citySlug,
  rubricSlug,
}: GetCategorySeoTextInterface): Promise<SeoContentModel | null> {
  const { db } = await getDatabase();
  const seoTextSlugPayload = await getCategorySeoTextSlug({
    categoryId,
    companySlug,
    citySlug,
    position,
  });
  if (!seoTextSlugPayload) {
    return null;
  }

  const seoContentsCollection = db.collection<SeoContentModel>(COL_SEO_CONTENTS);
  const seoText = await seoContentsCollection.findOne({
    slug: seoTextSlugPayload.seoTextSlug,
  });

  if (!seoText) {
    const newSeoTextResult = await seoContentsCollection.insertOne({
      url: seoTextSlugPayload.url,
      slug: seoTextSlugPayload.seoTextSlug,
      content: PAGE_EDITOR_DEFAULT_VALUE_STRING,
      rubricSlug,
      companySlug,
    });
    if (!newSeoTextResult.acknowledged) {
      return null;
    }
    const newSeoText = await seoContentsCollection.findOne({
      _id: newSeoTextResult.insertedId,
    });
    return newSeoText;
  }

  return seoText;
}

interface GetCategoryAllSeoTextsInterface extends Omit<GetCategorySeoTextInterface, 'citySlug'> {}
export async function getCategoryAllSeoTexts({
  companySlug,
  position,
  categoryId,
  rubricSlug,
}: GetCategoryAllSeoTextsInterface): Promise<SeoContentCitiesInterface> {
  const cities = await getCitiesList();
  let payload: SeoContentCitiesInterface = {};
  for await (const city of cities) {
    const seoText = await getCategorySeoText({
      companySlug,
      position,
      categoryId,
      rubricSlug,
      citySlug: city.slug,
    });
    if (seoText) {
      payload[city.slug] = seoText;
    }
  }
  return payload;
}

// product
interface GetProductSeoTextInterface {
  companySlug: string;
  citySlug: string;
  productId: ObjectIdModel;
  productSlug: string;
  rubricSlug: string;
}

export async function getProductSeoText({
  companySlug,
  productId,
  citySlug,
  productSlug,
  rubricSlug,
}: GetProductSeoTextInterface): Promise<SeoContentModel | null> {
  const { db } = await getDatabase();
  const seoContentsCollection = db.collection<SeoContentModel>(COL_SEO_CONTENTS);

  const seoTextSlugPayload = await getProductSeoTextSlug({
    companySlug,
    productId,
    citySlug,
    productSlug,
  });
  if (!seoTextSlugPayload) {
    return null;
  }

  const seoText = await seoContentsCollection.findOne({
    slug: seoTextSlugPayload.seoTextSlug,
  });

  if (!seoText) {
    const newSeoTextResult = await seoContentsCollection.insertOne({
      url: seoTextSlugPayload.url,
      slug: seoTextSlugPayload.seoTextSlug,
      content: PAGE_EDITOR_DEFAULT_VALUE_STRING,
      companySlug,
      rubricSlug,
    });
    if (!newSeoTextResult.acknowledged) {
      return null;
    }
    const newSeoText = await seoContentsCollection.findOne({
      _id: newSeoTextResult.insertedId,
    });
    return newSeoText;
  }

  return seoText;
}

interface GetProductAllSeoTextsInterface extends Omit<GetProductSeoTextInterface, 'citySlug'> {}
export async function getProductAllSeoTexts({
  companySlug,
  productId,
  productSlug,
  rubricSlug,
}: GetProductAllSeoTextsInterface): Promise<SeoContentCitiesInterface> {
  const cities = await getCitiesList();
  let payload: SeoContentCitiesInterface = {};
  for await (const city of cities) {
    const seoText = await getProductSeoText({
      companySlug,
      productId,
      productSlug,
      citySlug: city.slug,
      rubricSlug,
    });
    if (seoText) {
      payload[city.slug] = seoText;
    }
  }
  return payload;
}

interface GetSeoTextBySlugInterface {
  seoTextSlug: string;
  companySlug: string;
  rubricSlug: string;
  url: string;
}
export async function getSeoTextBySlug({
  seoTextSlug,
  companySlug,
  rubricSlug,
  url,
}: GetSeoTextBySlugInterface): Promise<SeoContentModel | null> {
  const { db } = await getDatabase();
  const seoContentsCollection = db.collection<SeoContentModel>(COL_SEO_CONTENTS);
  let seoText = await seoContentsCollection.findOne({
    slug: seoTextSlug,
  });

  if (!seoText) {
    const createdSeoTextResult = await seoContentsCollection.insertOne({
      slug: seoTextSlug,
      content: PAGE_EDITOR_DEFAULT_VALUE_STRING,
      seoLocales: [],
      companySlug,
      rubricSlug,
      url,
    });

    seoText = await seoContentsCollection.findOne({
      _id: createdSeoTextResult.insertedId,
    });
  }

  return seoText;
}
