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

interface CheckSeoContentUniquenessInterface {
  text?: string | null;
  oldText?: string | null;
  companySlug: string;
  seoContentId: ObjectIdModel;
}

export async function checkSeoContentUniqueness({
  text,
  oldText,
  companySlug,
  seoContentId,
}: CheckSeoContentUniquenessInterface) {
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
            callback: `https://${domain}/api/seo-content/uniqueness/${seoContentId}/${locale}`,
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

interface UpdateCitiesSeoContentInterface {
  seoContentsList: SeoContentCitiesInterface;
  companySlug: string;
}

export async function updateCitiesSeoContent({
  seoContentsList,
  companySlug,
}: UpdateCitiesSeoContentInterface) {
  const { db } = await getDatabase();
  const seoContentsCollection = db.collection<SeoContentModel>(COL_SEO_CONTENTS);

  const cities = await getCitiesList();
  for await (const city of cities) {
    const seoContent = seoContentsList[city.slug];

    if (seoContent) {
      const oldSeoContent = await seoContentsCollection.findOne({
        _id: new ObjectId(seoContent._id),
      });

      // check uniqueness
      await checkSeoContentUniqueness({
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

interface GetCatalogueSeoContentSlugInterface {
  filters: string[];
  rubricSlug: string;
  citySlug: string;
  companySlug: string;
}

interface GetCatalogueSeoContentSlugPayloadInterface {
  seoContentSlug: string;
  categoryLeaves: CategoryInterface[];
  noFiltersSelected: boolean;
  inCategory: boolean;
  rubricId: string;
}

interface GetCatalogueSeoContentSlugAttributeConfigInterface {
  attributeSlug: string;
  optionSlugs: string[];
}

export async function getCatalogueSeoContentSlug({
  filters,
  companySlug,
  citySlug,
  rubricSlug,
}: GetCatalogueSeoContentSlugInterface): Promise<GetCatalogueSeoContentSlugPayloadInterface | null> {
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
      console.log('getCatalogueSeoContentSlug Rubric not found');
      return null;
    }
    const rubricId = rubric._id.toHexString();

    // get company
    let companyId = DEFAULT_COMPANY_SLUG;
    if (companySlug !== DEFAULT_COMPANY_SLUG) {
      const company = await companiesCollection.findOne({ slug: companySlug });
      if (!company) {
        console.log('getCatalogueSeoContentSlug Company not found');
        return null;
      }

      companyId = company._id.toHexString();
    }

    // get city
    const city = await citiesCollection.findOne({ slug: citySlug });
    if (!city) {
      console.log('getCatalogueSeoContentSlug City not found');
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
      (acc: GetCatalogueSeoContentSlugAttributeConfigInterface[], filter) => {
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
      seoContentSlug: `${companyId}${cityId}${rubricId}${categoryIds}${brandIds}${brandCollectionIds}${attributeIds}${priceIds}`,
    };
  } catch (e) {
    console.log(e);
    return null;
  }
}

interface GetCatalogueAllSeoContentsInterface extends GetCatalogueSeoContentSlugInterface {}
interface GetCatalogueAllSeoContentsPayloadInterface {
  seoContentTop?: SeoContentModel | null;
  seoContentTopSlug: string;
  seoContentBottom?: SeoContentModel | null;
  seoContentBottomSlug: string;
  editUrl: string;
  textTopEditUrl: string;
  textBottomEditUrl: string;
}

export async function getCatalogueAllSeoContents(
  props: GetCatalogueAllSeoContentsInterface,
): Promise<GetCatalogueAllSeoContentsPayloadInterface | null> {
  const { db } = await getDatabase();
  const seoContentsCollection = db.collection<SeoContentModel>(COL_SEO_CONTENTS);
  const payload = await getCatalogueSeoContentSlug(props);

  if (!payload) {
    return null;
  }

  const { noFiltersSelected, rubricId, seoContentSlug, categoryLeaves } = payload;

  const seoContentTopSlug = `${seoContentSlug}${CATALOGUE_SEO_TEXT_POSITION_TOP}`;
  const seoContentTop = await seoContentsCollection.findOne({
    slug: seoContentTopSlug,
  });

  const seoContentBottomSlug = `${seoContentSlug}${CATALOGUE_SEO_TEXT_POSITION_BOTTOM}`;
  const seoContentBottom = await seoContentsCollection.findOne({
    slug: seoContentBottomSlug,
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
    textTopEditUrl = `${baseEditUrl}/seo-content/${seoContentTopSlug}`;
    textBottomEditUrl = `${baseEditUrl}/seo-content/${seoContentBottomSlug}`;
  }

  return {
    editUrl,
    textTopEditUrl,
    textBottomEditUrl,
    seoContentTop,
    seoContentTopSlug,
    seoContentBottom,
    seoContentBottomSlug,
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
}

export async function getProductSeoContentSlug({
  companySlug,
  citySlug,
  productId,
  productSlug,
}: GetProductSeoContentSlugInterface): Promise<GetDocumentSeoContentSlugPayloadInterface | null> {
  try {
    const { db } = await getDatabase();
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

// rubric
interface GetRubricSeoContentSlugInterface {
  rubricId: ObjectIdModel;
  rubricSlug: string;
  citySlug: string;
  companySlug: string;
  position: DescriptionPositionType;
}

export async function getRubricSeoContentSlug({
  companySlug,
  citySlug,
  rubricId,
  rubricSlug,
  position,
}: GetRubricSeoContentSlugInterface): Promise<GetDocumentSeoContentSlugPayloadInterface | null> {
  try {
    const { db } = await getDatabase();
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

// category
interface GetCategorySeoContentSlugInterface {
  categoryId: ObjectIdModel;
  citySlug: string;
  companySlug: string;
  position: DescriptionPositionType;
}

export async function getCategorySeoContentSlug({
  companySlug,
  citySlug,
  categoryId,
  position,
}: GetCategorySeoContentSlugInterface): Promise<GetDocumentSeoContentSlugPayloadInterface | null> {
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

// rubric
interface GetRubricSeoContentInterface {
  companySlug: string;
  position: DescriptionPositionType;
  rubricSlug: string;
  rubricId: ObjectIdModel;
  citySlug: string;
}

export async function getRubricSeoContent({
  companySlug,
  position,
  rubricSlug,
  rubricId,
  citySlug,
}: GetRubricSeoContentInterface): Promise<SeoContentModel | null> {
  const { db } = await getDatabase();

  const seoContentSlugPayload = await getRubricSeoContentSlug({
    rubricId,
    companySlug,
    rubricSlug,
    citySlug,
    position,
  });
  if (!seoContentSlugPayload) {
    return null;
  }

  const seoContentsCollection = db.collection<SeoContentModel>(COL_SEO_CONTENTS);
  const seoContent = await seoContentsCollection.findOne({
    slug: seoContentSlugPayload.seoContentSlug,
  });

  if (!seoContent) {
    const newSeoContentResult = await seoContentsCollection.insertOne({
      url: seoContentSlugPayload.url,
      slug: seoContentSlugPayload.seoContentSlug,
      content: PAGE_EDITOR_DEFAULT_VALUE_STRING,
      rubricSlug,
      companySlug,
    });
    if (!newSeoContentResult.acknowledged) {
      return null;
    }
    const newSeoContent = await seoContentsCollection.findOne({
      _id: newSeoContentResult.insertedId,
    });
    return newSeoContent;
  }

  return seoContent;
}

interface GetRubricAllSeoContentsInterface extends Omit<GetRubricSeoContentInterface, 'citySlug'> {}
export async function getRubricAllSeoContents({
  companySlug,
  position,
  rubricSlug,
  rubricId,
}: GetRubricAllSeoContentsInterface): Promise<SeoContentCitiesInterface> {
  const cities = await getCitiesList();
  let payload: SeoContentCitiesInterface = {};
  for await (const city of cities) {
    const seoContent = await getRubricSeoContent({
      companySlug,
      position,
      rubricSlug,
      rubricId,
      citySlug: city.slug,
    });
    if (seoContent) {
      payload[city.slug] = seoContent;
    }
  }
  return payload;
}

// category
interface GetCategorySeoContentInterface {
  companySlug: string;
  citySlug: string;
  position: DescriptionPositionType;
  categoryId: ObjectIdModel;
  rubricSlug: string;
}

export async function getCategorySeoContent({
  companySlug,
  position,
  categoryId,
  citySlug,
  rubricSlug,
}: GetCategorySeoContentInterface): Promise<SeoContentModel | null> {
  const { db } = await getDatabase();
  const seoContentSlugPayload = await getCategorySeoContentSlug({
    categoryId,
    companySlug,
    citySlug,
    position,
  });
  if (!seoContentSlugPayload) {
    return null;
  }

  const seoContentsCollection = db.collection<SeoContentModel>(COL_SEO_CONTENTS);
  const seoContent = await seoContentsCollection.findOne({
    slug: seoContentSlugPayload.seoContentSlug,
  });

  if (!seoContent) {
    const newSeoContentResult = await seoContentsCollection.insertOne({
      url: seoContentSlugPayload.url,
      slug: seoContentSlugPayload.seoContentSlug,
      content: PAGE_EDITOR_DEFAULT_VALUE_STRING,
      rubricSlug,
      companySlug,
    });
    if (!newSeoContentResult.acknowledged) {
      return null;
    }
    const newSeoContent = await seoContentsCollection.findOne({
      _id: newSeoContentResult.insertedId,
    });
    return newSeoContent;
  }

  return seoContent;
}

interface GetCategoryAllSeoContentsInterface
  extends Omit<GetCategorySeoContentInterface, 'citySlug'> {}
export async function getCategoryAllSeoContents({
  companySlug,
  position,
  categoryId,
  rubricSlug,
}: GetCategoryAllSeoContentsInterface): Promise<SeoContentCitiesInterface> {
  const cities = await getCitiesList();
  let payload: SeoContentCitiesInterface = {};
  for await (const city of cities) {
    const seoContent = await getCategorySeoContent({
      companySlug,
      position,
      categoryId,
      rubricSlug,
      citySlug: city.slug,
    });
    if (seoContent) {
      payload[city.slug] = seoContent;
    }
  }
  return payload;
}

// product
interface GetProductSeoContentInterface {
  companySlug: string;
  citySlug: string;
  productId: ObjectIdModel;
  productSlug: string;
  rubricSlug: string;
}

export async function getProductSeoContent({
  companySlug,
  productId,
  citySlug,
  productSlug,
  rubricSlug,
}: GetProductSeoContentInterface): Promise<SeoContentModel | null> {
  const { db } = await getDatabase();
  const seoContentsCollection = db.collection<SeoContentModel>(COL_SEO_CONTENTS);

  const seoContentSlugPayload = await getProductSeoContentSlug({
    companySlug,
    productId,
    citySlug,
    productSlug,
  });
  if (!seoContentSlugPayload) {
    return null;
  }

  const seoContent = await seoContentsCollection.findOne({
    slug: seoContentSlugPayload.seoContentSlug,
  });

  if (!seoContent) {
    const newSeoContentResult = await seoContentsCollection.insertOne({
      url: seoContentSlugPayload.url,
      slug: seoContentSlugPayload.seoContentSlug,
      content: PAGE_EDITOR_DEFAULT_VALUE_STRING,
      companySlug,
      rubricSlug,
    });
    if (!newSeoContentResult.acknowledged) {
      return null;
    }
    const newSeoContent = await seoContentsCollection.findOne({
      _id: newSeoContentResult.insertedId,
    });
    return newSeoContent;
  }

  return seoContent;
}

interface GetProductAllSeoContentsInterface
  extends Omit<GetProductSeoContentInterface, 'citySlug'> {}
export async function getProductAllSeoContents({
  companySlug,
  productId,
  productSlug,
  rubricSlug,
}: GetProductAllSeoContentsInterface): Promise<SeoContentCitiesInterface> {
  const cities = await getCitiesList();
  let payload: SeoContentCitiesInterface = {};
  for await (const city of cities) {
    const seoContent = await getProductSeoContent({
      companySlug,
      productId,
      productSlug,
      citySlug: city.slug,
      rubricSlug,
    });
    if (seoContent) {
      payload[city.slug] = seoContent;
    }
  }
  return payload;
}

interface GetSeoContentBySlugInterface {
  seoContentSlug: string;
  companySlug: string;
  rubricSlug: string;
  url: string;
}
export async function getSeoContentBySlug({
  seoContentSlug,
  companySlug,
  rubricSlug,
  url,
}: GetSeoContentBySlugInterface): Promise<SeoContentModel | null> {
  const { db } = await getDatabase();
  const seoContentsCollection = db.collection<SeoContentModel>(COL_SEO_CONTENTS);
  let seoContent = await seoContentsCollection.findOne({
    slug: seoContentSlug,
  });

  if (!seoContent) {
    const createdSeoContentResult = await seoContentsCollection.insertOne({
      slug: seoContentSlug,
      content: PAGE_EDITOR_DEFAULT_VALUE_STRING,
      seoLocales: [],
      companySlug,
      rubricSlug,
      url,
    });

    seoContent = await seoContentsCollection.findOne({
      _id: createdSeoContentResult.insertedId,
    });
  }

  return seoContent;
}
