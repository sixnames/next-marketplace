import { reactPageCellPlugins } from 'components/PageEditor';
import {
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
  ObjectIdModel,
  RubricModel,
  SeoContentModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { AttributeInterface, SeoContentCitiesInterface } from 'db/uiInterfaces';
import { castCatalogueFilters } from 'lib/catalogueUtils';
import { castConfigs, getConfigStringValue } from 'lib/configsUtils';
import { castCatalogueFilter } from 'lib/optionsUtils';
import { sortBy } from 'lodash';
import fetch from 'node-fetch';
import qs from 'qs';
import { getTextContents, Value } from '@react-page/editor';

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

interface CheckCitiesSeoTextUniquenessInterface {
  seoTextsList: SeoContentCitiesInterface;
  companySlug: string;
}

export async function checkCitiesSeoTextUniqueness({
  seoTextsList,
  companySlug,
}: CheckCitiesSeoTextUniquenessInterface) {
  const { db } = await getDatabase();
  const seoContentsCollection = db.collection<SeoContentModel>(COL_SEO_CONTENTS);

  const cities = await getCitiesList();
  for await (const city of cities) {
    const seoContent = seoTextsList[city.slug];

    if (seoContent) {
      const oldSeoContent = await seoContentsCollection.findOne({
        _id: seoContent._id,
      });
      await checkSeoTextUniqueness({
        companySlug,
        seoContentId: seoContent._id,
        text: seoContent.content,
        oldText: oldSeoContent?.content,
      });
    }
  }
}

interface GetCatalogueSeoTextSlugInterface {
  filters: string[];
  rubricSlug: string;
  citySlug: string;
  companySlug: string;
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
}: GetCatalogueSeoTextSlugInterface): Promise<string | null> {
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

interface GetProductSeoTextSlugInterface {
  productId: ObjectIdModel;
  citySlug: string;
  companySlug: string;
}

export async function getProductSeoTextSlug({
  companySlug,
  citySlug,
  productId,
}: GetProductSeoTextSlugInterface): Promise<string | null> {
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

    return `${companyId}${cityId}${productId.toHexString()}`;
  } catch (e) {
    console.log(e);
    return null;
  }
}
