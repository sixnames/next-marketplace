import {
  CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
  CATALOGUE_SEO_TEXT_POSITION_TOP,
  DEFAULT_CITY,
  DEFAULT_COMPANY_SLUG,
  DEFAULT_LOCALE,
  LOCALES,
  REQUEST_METHOD_POST,
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
} from 'db/collectionNames';
import {
  AttributeModel,
  BrandCollectionModel,
  BrandModel,
  CategoryModel,
  CityModel,
  CompanyModel,
  ConfigModel,
  ProductModel,
  RubricModel,
  TranslationModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { AttributeInterface } from 'db/uiInterfaces';
import { castCatalogueFilters } from 'lib/catalogueUtils';
import { castConfigs, getConfigStringValue } from 'lib/configsUtils';
import { castCatalogueFilter } from 'lib/optionsUtils';
import { get, sortBy } from 'lodash';
import fetch from 'node-fetch';
import qs from 'qs';

interface CheckTextUniquenessInterface {
  textI18n?: TranslationModel | null;
  oldTextI18n?: TranslationModel | null;
  callback: (locale: string) => string;
  companySlug: string;
}

export async function checkTextUniqueness({
  textI18n,
  oldTextI18n,
  callback,
  companySlug,
}: CheckTextUniquenessInterface) {
  try {
    const { db } = await getDatabase();
    const configSlug = 'textUniquenessApiKey';
    const configsCollection = db.collection<ConfigModel>(COL_CONFIGS);
    const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);
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

    // get excluded domain
    let domain = process.env.DEFAULT_DOMAIN;
    if (companySlug !== DEFAULT_COMPANY_SLUG) {
      const company = await companiesCollection.findOne({
        slug: companySlug,
      });
      domain = company?.domain || process.env.DEFAULT_DOMAIN;
    }

    if (uniqueTextApiUrl && uniqueTextApiKey && domain) {
      for await (const locale of LOCALES) {
        const text = get(textI18n, locale);
        const oldText = get(oldTextI18n, locale);

        if (text && text !== oldText) {
          const body = {
            userkey: uniqueTextApiKey,
            exceptdomain: domain,
            callback: `https://${domain}${callback(locale)}`,
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

// Product
interface CheckProductDescriptionUniquenessInterface {
  cardDescriptionI18n?: TranslationModel | null;
  oldCardDescriptionI18n?: TranslationModel | null;
  product: ProductModel;
  companySlug: string;
}

export async function checkProductDescriptionUniqueness({
  product,
  cardDescriptionI18n,
  oldCardDescriptionI18n,
  companySlug,
}: CheckProductDescriptionUniquenessInterface) {
  try {
    await checkTextUniqueness({
      companySlug,
      textI18n: cardDescriptionI18n,
      oldTextI18n: oldCardDescriptionI18n,
      callback: (locale) => {
        return `/api/product/uniqueness/${product._id.toHexString()}/${locale}/${companySlug}`;
      },
    });
  } catch (e) {
    console.log(e);
  }
}

// Rubric
interface CheckRubricSeoTextUniquenessInterface {
  textTopI18n?: TranslationModel | null;
  textBottomI18n?: TranslationModel | null;
  oldTextTopI18n?: TranslationModel | null;
  oldTextBottomI18n?: TranslationModel | null;
  rubric: RubricModel;
  companySlug: string;
}

export async function checkRubricSeoTextUniqueness({
  rubric,
  textTopI18n,
  textBottomI18n,
  oldTextTopI18n,
  oldTextBottomI18n,
  companySlug,
}: CheckRubricSeoTextUniquenessInterface) {
  try {
    await checkTextUniqueness({
      companySlug,
      textI18n: textTopI18n,
      oldTextI18n: oldTextTopI18n,
      callback: (locale) => {
        return `/api/rubric/uniqueness/${rubric._id.toHexString()}/${locale}/${CATALOGUE_SEO_TEXT_POSITION_TOP}/${companySlug}`;
      },
    });
    await checkTextUniqueness({
      companySlug,
      textI18n: textBottomI18n,
      oldTextI18n: oldTextBottomI18n,
      callback: (locale) => {
        return `/api/rubric/uniqueness/${rubric._id.toHexString()}/${locale}/${CATALOGUE_SEO_TEXT_POSITION_BOTTOM}/${companySlug}`;
      },
    });
  } catch (e) {
    console.log(e);
  }
}

// Category
interface CheckCategorySeoTextUniquenessInterface {
  textTopI18n?: TranslationModel | null;
  textBottomI18n?: TranslationModel | null;
  oldTextTopI18n?: TranslationModel | null;
  oldTextBottomI18n?: TranslationModel | null;
  category: CategoryModel;
  companySlug: string;
}

export async function checkCategorySeoTextUniqueness({
  category,
  textTopI18n,
  textBottomI18n,
  oldTextTopI18n,
  oldTextBottomI18n,
  companySlug,
}: CheckCategorySeoTextUniquenessInterface) {
  try {
    await checkTextUniqueness({
      companySlug,
      textI18n: textTopI18n,
      oldTextI18n: oldTextTopI18n,
      callback: (locale) => {
        return `/api/category/uniqueness/${category._id.toHexString()}/${locale}/${CATALOGUE_SEO_TEXT_POSITION_TOP}/${companySlug}`;
      },
    });
    await checkTextUniqueness({
      companySlug,
      textI18n: textBottomI18n,
      oldTextI18n: oldTextBottomI18n,
      callback: (locale) => {
        return `/api/category/uniqueness/${category._id.toHexString()}/${locale}/${CATALOGUE_SEO_TEXT_POSITION_BOTTOM}/${companySlug}`;
      },
    });
  } catch (e) {
    console.log(e);
  }
}

interface GetCatalogueSeoTextParamsInterface {
  filters: string[];
  rubricSlug: string;
  citySlug: string;
  companySlug: string;
}

interface GetCatalogueSeoTextParamsAttributeConfigInterface {
  attributeSlug: string;
  optionSlugs: string[];
}

export async function getCatalogueSeoTextParams({
  filters,
  companySlug,
  citySlug,
  rubricSlug,
}: GetCatalogueSeoTextParamsInterface): Promise<string | null> {
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
      console.log('getCatalogueSeoTextParams Rubric not found');
      return null;
    }
    const rubricId = rubric._id.toHexString();

    // get company
    let companyId = DEFAULT_COMPANY_SLUG;
    const company = await companiesCollection.findOne({ slug: rubricSlug });
    if (company) {
      companyId = company._id.toHexString();
    }
    if (companySlug !== DEFAULT_COMPANY_SLUG && !company) {
      console.log('getCatalogueSeoTextParams Company not found');
      return null;
    }

    // get city
    const city = await citiesCollection.findOne({ slug: citySlug });
    if (!city) {
      console.log('getCatalogueSeoTextParams City not found');
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
    const categoryIds = categories.reduce((acc: string, { _id }) => {
      return `${acc}${_id.toHexString()}`;
    }, '');

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
    const brandIds = brands.reduce((acc: string, { _id }) => {
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
    const brandCollectionIds = brandCollections.reduce((acc: string, { _id }) => {
      return `${acc}${_id.toHexString()}`;
    }, '');

    // get prices
    const priceSlugs = priceFilters.map((filter) => {
      const { optionSlug } = castCatalogueFilter(filter);
      return optionSlug;
    });
    const priceAttribute = getPriceAttribute(city.currency);
    const priceOptions = (priceAttribute.options || []).filter(({ slug }) => {
      return priceSlugs.includes(slug);
    });
    const priceIds = priceOptions.reduce((acc: string, { _id }) => {
      return `${acc}${_id.toHexString()}`;
    }, '');

    // get attributes
    const attributeConfigs = realFilters.reduce(
      (acc: GetCatalogueSeoTextParamsAttributeConfigInterface[], filter) => {
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
    const attributeIds = attributes.reduce((acc: string, attribute) => {
      const attributeId = (attribute.options || []).reduce((innerAcc: string, { _id }) => {
        return `${innerAcc}${attribute._id.toHexString()}${_id.toHexString()}`;
      }, '');
      return `${acc}${attributeId}`;
    }, '');

    return `${companyId}${cityId}${rubricId}${categoryIds}${brandIds}${brandCollectionIds}${attributeIds}${priceIds}`;
  } catch (e) {
    console.log(e);
    return null;
  }
}
