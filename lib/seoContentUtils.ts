import { COL_OPTIONS } from 'db/collectionNames';
import { getCitiesList } from 'db/dao/cities/getCitiesList';
import { DescriptionPositionType, ObjectIdModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import {
  AttributeInterface,
  CategoryInterface,
  SeoContentCitiesInterface,
  SeoContentInterface,
} from 'db/uiInterfaces';
import {
  CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
  CATALOGUE_SEO_TEXT_POSITION_TOP,
  DEFAULT_COMPANY_SLUG,
  DEFAULT_LOCALE,
  FILTER_CATEGORY_KEY,
  FILTER_SEPARATOR,
  PAGE_EDITOR_DEFAULT_VALUE_STRING,
  SORT_DESC,
} from 'lib/config/common';
import { getPriceAttribute } from 'lib/config/constantAttributes';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { sortBy } from 'lodash';
import { ObjectId } from 'mongodb';
import { castUrlFilters } from './castUrlFilters';
import { getFieldStringLocale } from './i18n';
import { sortStringArray } from './stringUtils';
import { getTreeFromList, getTreeLeaves } from './treeUtils';

const links = getProjectLinks();

export function castSeoContent(
  seoContent?: SeoContentInterface | null,
  locale?: string | null,
): SeoContentInterface | null {
  if (!seoContent) {
    return null;
  }

  const currentLocale = locale || DEFAULT_LOCALE;

  return {
    ...seoContent,
    title: getFieldStringLocale(seoContent.titleI18n, currentLocale),
    metaDescription: getFieldStringLocale(seoContent.metaDescriptionI18n, currentLocale),
    metaTitle: getFieldStringLocale(seoContent.metaTitleI18n, currentLocale),
  };
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
  rubricSlug: string;
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
    const collections = await getDbCollections();
    const rubricsCollection = collections.rubricsCollection();
    const citiesCollection = collections.citiesCollection();
    const categoriesCollection = collections.categoriesCollection();
    const brandsCollection = collections.brandsCollection();
    const brandCollectionsCollection = collections.brandCollectionsCollection();
    const companiesCollection = collections.companiesCollection();
    const attributesCollection = collections.attributesCollection();
    const {
      brandFilters,
      brandCollectionFilters,
      categoryCastedFilters,
      priceFilters,
      realFilters,
      noFiltersSelected,
      inCategory,
      page,
    } = await castUrlFilters({
      filters,
      searchFieldName: '_id',
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
      const splittedOption = filter.split(FILTER_SEPARATOR);
      const optionSlug = splittedOption[1];
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
        const splittedOption = filter.split(FILTER_SEPARATOR);
        const attributeSlug = splittedOption[0];
        const optionSlug = splittedOption[1];
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

    let pageId = '';
    if (page && page > 1) {
      pageId = `${page}`;
    }

    return {
      rubricId,
      rubricSlug: rubric.slug,
      inCategory,
      noFiltersSelected,
      categoryLeaves,
      seoContentSlug: `${companyId}${cityId}${rubricId}${categoryIds}${brandIds}${brandCollectionIds}${attributeIds}${priceIds}${pageId}`,
    };
  } catch (e) {
    console.log('getCatalogueSeoContentSlug error', e);
    return null;
  }
}

interface GetCatalogueAllSeoContentsInterface extends GetCatalogueSeoContentSlugInterface {
  locale: string;
  asPath: string;
}
interface GetCatalogueAllSeoContentsPayloadInterface {
  seoContentTop?: SeoContentInterface | null;
  seoContentTopSlug: string;
  seoContentBottom?: SeoContentInterface | null;
  seoContentBottomSlug: string;
  editUrl: string;
  textTopEditUrl: string;
  textBottomEditUrl: string;
}

export async function getCatalogueAllSeoContents(
  props: GetCatalogueAllSeoContentsInterface,
): Promise<GetCatalogueAllSeoContentsPayloadInterface | null> {
  const collections = await getDbCollections();
  const seoContentsCollection = collections.seoContentsCollection();
  const payload = await getCatalogueSeoContentSlug(props);

  if (!payload) {
    return null;
  }

  const { rubricSlug, seoContentSlug } = payload;

  const seoContentTopSlug = `${seoContentSlug}${CATALOGUE_SEO_TEXT_POSITION_TOP}`;
  let seoContentTop = await seoContentsCollection.findOne({
    slug: seoContentTopSlug,
  });

  const seoContentBottomSlug = `${seoContentSlug}${CATALOGUE_SEO_TEXT_POSITION_BOTTOM}`;
  let seoContentBottom = await seoContentsCollection.findOne({
    slug: seoContentBottomSlug,
  });

  const baseEditUrl = `/rubrics/${rubricSlug}`;
  let editUrl = baseEditUrl;
  const textTopEditUrl = `${baseEditUrl}/seo-content/${seoContentTopSlug}`;
  const textBottomEditUrl = `${baseEditUrl}/seo-content/${seoContentBottomSlug}`;

  if (!seoContentTop) {
    seoContentTop = {
      _id: new ObjectId(),
      url: props.asPath,
      slug: seoContentTopSlug,
      content: PAGE_EDITOR_DEFAULT_VALUE_STRING,
      companySlug: props.companySlug,
      rubricSlug,
    };
  }

  if (!seoContentBottom) {
    seoContentBottom = {
      _id: new ObjectId(),
      url: props.asPath,
      slug: seoContentBottomSlug,
      content: PAGE_EDITOR_DEFAULT_VALUE_STRING,
      companySlug: props.companySlug,
      rubricSlug,
    };
  }

  return {
    editUrl,
    textTopEditUrl,
    textBottomEditUrl,
    seoContentTop: castSeoContent(seoContentTop, props.locale),
    seoContentTopSlug,
    seoContentBottom: castSeoContent(seoContentBottom, props.locale),
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
    const collections = await getDbCollections();
    const citiesCollection = collections.citiesCollection();
    const companiesCollection = collections.companiesCollection();

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
      url: `/${productSlug}`,
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
    const collections = await getDbCollections();
    const citiesCollection = collections.citiesCollection();
    const companiesCollection = collections.companiesCollection();

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
      url: `${links.catalogue.url}/${rubricSlug}`,
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
    const collections = await getDbCollections();
    const citiesCollection = collections.citiesCollection();
    const companiesCollection = collections.companiesCollection();
    const categoriesCollection = collections.categoriesCollection();
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
      const splittedOption = filter.split(FILTER_SEPARATOR);
      const optionSlug = splittedOption[1];
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
      url: `${links.catalogue.url}/${category.rubricSlug}/${sortedFilters.join('/')}`,
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
  locale: string;
}

export async function getRubricSeoContent({
  companySlug,
  position,
  rubricSlug,
  rubricId,
  citySlug,
  locale,
}: GetRubricSeoContentInterface): Promise<SeoContentInterface | null> {
  const collections = await getDbCollections();

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

  const seoContentsCollection = collections.seoContentsCollection();
  const seoContent = await seoContentsCollection.findOne({
    slug: seoContentSlugPayload.seoContentSlug,
  });

  if (!seoContent) {
    const newSeoContent = {
      _id: new ObjectId(),
      url: seoContentSlugPayload.url,
      slug: seoContentSlugPayload.seoContentSlug,
      content: PAGE_EDITOR_DEFAULT_VALUE_STRING,
      rubricSlug,
      companySlug,
    };
    return newSeoContent;
  }

  return castSeoContent(seoContent, locale);
}

interface GetRubricAllSeoContentsInterface extends Omit<GetRubricSeoContentInterface, 'citySlug'> {}
export async function getRubricAllSeoContents({
  companySlug,
  position,
  rubricSlug,
  rubricId,
  locale,
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
      locale,
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
  locale: string;
}

export async function getCategorySeoContent({
  companySlug,
  position,
  categoryId,
  citySlug,
  rubricSlug,
  locale,
}: GetCategorySeoContentInterface): Promise<SeoContentInterface | null> {
  const collections = await getDbCollections();
  const seoContentSlugPayload = await getCategorySeoContentSlug({
    categoryId,
    companySlug,
    citySlug,
    position,
  });
  if (!seoContentSlugPayload) {
    return null;
  }

  const seoContentsCollection = collections.seoContentsCollection();
  const seoContent = await seoContentsCollection.findOne({
    slug: seoContentSlugPayload.seoContentSlug,
  });

  if (!seoContent) {
    const newSeoContent = {
      _id: new ObjectId(),
      url: seoContentSlugPayload.url,
      slug: seoContentSlugPayload.seoContentSlug,
      content: PAGE_EDITOR_DEFAULT_VALUE_STRING,
      rubricSlug,
      companySlug,
    };
    return newSeoContent;
  }

  return castSeoContent(seoContent, locale);
}

interface GetCategoryAllSeoContentsInterface
  extends Omit<GetCategorySeoContentInterface, 'citySlug'> {}
export async function getCategoryAllSeoContents({
  companySlug,
  position,
  categoryId,
  rubricSlug,
  locale,
}: GetCategoryAllSeoContentsInterface): Promise<SeoContentCitiesInterface> {
  const cities = await getCitiesList();
  let payload: SeoContentCitiesInterface = {};
  for await (const city of cities) {
    const seoContent = await getCategorySeoContent({
      companySlug,
      position,
      categoryId,
      rubricSlug,
      locale,
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
  locale: string;
}

export async function getProductSeoContent({
  companySlug,
  productId,
  citySlug,
  productSlug,
  rubricSlug,
  locale,
}: GetProductSeoContentInterface): Promise<SeoContentInterface | null> {
  const collections = await getDbCollections();
  const seoContentsCollection = collections.seoContentsCollection();

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
    const newSeoContent = {
      _id: new ObjectId(),
      url: seoContentSlugPayload.url,
      slug: seoContentSlugPayload.seoContentSlug,
      content: PAGE_EDITOR_DEFAULT_VALUE_STRING,
      companySlug,
      rubricSlug,
    };
    return newSeoContent;
  }

  return castSeoContent(seoContent, locale);
}

interface GetProductAllSeoContentsInterface
  extends Omit<GetProductSeoContentInterface, 'citySlug'> {}
export async function getProductAllSeoContents({
  companySlug,
  productId,
  productSlug,
  rubricSlug,
  locale,
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
      locale,
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
}: GetSeoContentBySlugInterface): Promise<SeoContentInterface | null> {
  const collections = await getDbCollections();
  const seoContentsCollection = collections.seoContentsCollection();
  let seoContent = await seoContentsCollection.findOne({
    slug: seoContentSlug,
  });

  if (!seoContent) {
    seoContent = {
      _id: new ObjectId(),
      slug: seoContentSlug,
      content: PAGE_EDITOR_DEFAULT_VALUE_STRING,
      seoLocales: [],
      companySlug,
      rubricSlug,
      url,
    };
  }

  return seoContent;
}
