import { CatalogueInterface } from 'components/Catalogue';
import { getCategoryFilterAttribute, getPriceAttribute } from 'config/constantAttributes';
import { DEFAULT_LAYOUT } from 'config/constantSelects';
import {
  COL_CITIES,
  COL_CONFIGS,
  COL_COUNTRIES,
  COL_OPTIONS,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
} from 'db/collectionNames';
import {
  getCatalogueRubricPipeline,
  productAttributesPipeline,
  productCategoriesPipeline,
  productConnectionsPipeline,
} from 'db/dao/constantPipelines';
import {
  AttributeViewVariantModel,
  CatalogueBreadcrumbModel,
  CityModel,
  ConfigModel,
  CountryModel,
  ObjectIdModel,
  OptionModel,
  ShopProductModel,
} from 'db/dbModels';
import {
  ATTRIBUTE_VIEW_VARIANT_LIST,
  ATTRIBUTE_VIEW_VARIANT_OUTER_RATING,
  CATALOGUE_FILTER_LIMIT,
  QUERY_FILTER_PAGE,
  CATALOGUE_FILTER_VISIBLE_OPTIONS,
  FILTER_SEPARATOR,
  CATALOGUE_PRODUCTS_LIMIT,
  CATALOGUE_SNIPPET_VISIBLE_ATTRIBUTES,
  DEFAULT_COMPANY_SLUG,
  DEFAULT_LOCALE,
  PAGINATION_DEFAULT_LIMIT,
  PRICE_ATTRIBUTE_SLUG,
  ROUTE_CATALOGUE,
  SHOP_PRODUCTS_DEFAULT_SORT_BY_KEY,
  SORT_ASC,
  SORT_BY_KEY,
  SORT_DESC,
  SORT_DESC_STR,
  SORT_DIR_KEY,
  DEFAULT_PAGE,
  RUBRIC_KEY,
  DEFAULT_CURRENCY,
  CATALOGUE_CATEGORY_KEY,
} from 'config/common';
import { getDatabase } from 'db/mongodb';
import {
  AttributeInterface,
  CatalogueDataInterface,
  CatalogueFilterAttributeInterface,
  CatalogueFilterAttributeOptionInterface,
  CatalogueProductPricesInterface,
  CatalogueProductsAggregationInterface,
  OptionInterface,
  ProductConnectionInterface,
  ProductConnectionItemInterface,
  RubricAttributeInterface,
  RubricInterface,
} from 'db/uiInterfaces';
import { alwaysArray } from 'lib/arrayUtils';
import { getFieldStringLocale } from 'lib/i18n';
import { noNaN } from 'lib/numbers';
import { getTreeFromList } from 'lib/optionsUtils';
import { getProductCurrentViewCastedAttributes } from 'lib/productAttributesUtils';
import { castDbData, getSiteInitialData } from 'lib/ssrUtils';
import { generateSnippetTitle, generateTitle } from 'lib/titleUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

export interface CastCatalogueParamToObjectPayloadInterface {
  slug: string;
  value: string;
}

export function castCatalogueParamToObject(
  param: string,
): CastCatalogueParamToObjectPayloadInterface {
  const paramArray = param.split('-');
  const slug = `${paramArray[0]}`;
  const value = `${paramArray[1]}`;
  return {
    slug,
    value,
  };
}

export interface GetRubricCatalogueOptionsInterface {
  options: OptionInterface[];
  // maxVisibleOptions: number;
  visibleOptionsSlugs: string[];
  city: string;
}

export function getRubricCatalogueOptions({
  options,
  // maxVisibleOptions,
  visibleOptionsSlugs,
  city,
}: GetRubricCatalogueOptionsInterface): OptionInterface[] {
  const visibleOptions = options.filter(({ slug }) => {
    return visibleOptionsSlugs.includes(slug);
  });
  // .slice(0, maxVisibleOptions);

  return visibleOptions.map((option) => {
    return {
      ...option,
      options: getRubricCatalogueOptions({
        options: option.options || [],
        // maxVisibleOptions,
        visibleOptionsSlugs,
        city,
      }),
    };
  });
}

interface CastRubricsToCatalogueAttributeInterface {
  rubrics: RubricInterface[];
  filters: string[];
  locale: string;
  basePath: string;
  visibleAttributesCount?: number | null;
  visibleOptionsCount?: number | null;
}

export function castRubricsToCatalogueAttribute({
  rubrics,
  filters,
  locale,
  basePath,
  visibleOptionsCount,
}: // visibleAttributesCount,
CastRubricsToCatalogueAttributeInterface): CatalogueFilterAttributeInterface {
  const castedOptions: CatalogueFilterAttributeOptionInterface[] = [];

  const realFilter = filters.filter((filterItem) => {
    const filterItemArr = filterItem.split(FILTER_SEPARATOR);
    const filterName = filterItemArr[0];
    return filterName !== QUERY_FILTER_PAGE;
  });

  rubrics.forEach((rubric) => {
    const optionSlug = `${RUBRIC_KEY}${FILTER_SEPARATOR}${rubric.slug}`;
    const isSelected = realFilter.includes(optionSlug);

    const optionNextSlug = isSelected
      ? [...realFilter]
          .filter((pathArg) => {
            return pathArg !== optionSlug;
          })
          .join('/')
      : [...realFilter, optionSlug].join('/');

    const castedOption = {
      _id: rubric._id,
      name: getFieldStringLocale(rubric.nameI18n, locale),
      slug: rubric.slug,
      nextSlug: `${basePath}/${optionNextSlug}`,
      isSelected,
    };

    castedOptions.push(castedOption);
  });

  // attribute
  const otherSelectedValues = realFilter.filter((param) => {
    const castedParam = castCatalogueParamToObject(param);
    return castedParam.slug !== RUBRIC_KEY;
  });
  const clearSlug = `${basePath}/${otherSelectedValues.join('/')}`;

  const isSelected = castedOptions.some(({ isSelected }) => isSelected);

  const castedAttribute: CatalogueFilterAttributeInterface = {
    _id: new ObjectId(),
    attributeId: new ObjectId(),
    clearSlug,
    slug: RUBRIC_KEY,
    name: getFieldStringLocale(
      {
        [DEFAULT_LOCALE]: 'Рубрика',
      },
      locale,
    ),
    options: castedOptions,
    totalOptionsCount: castedOptions.length,
    isSelected,
    viewVariant: ATTRIBUTE_VIEW_VARIANT_LIST as AttributeViewVariantModel,
    notShowAsAlphabet: false,
  };

  // slice options if limit is specified
  const finalCastedAttribute = visibleOptionsCount
    ? {
        ...castedAttribute,
        options: castedAttribute.options.slice(0, visibleOptionsCount),
      }
    : castedAttribute;

  return finalCastedAttribute;
}

export interface GetCatalogueAttributesInterface {
  filters: string[];
  attributes: RubricAttributeInterface[];
  locale: string;
  productsPrices: CatalogueProductPricesInterface[];
  basePath: string;
  visibleAttributesCount?: number | null;
  visibleOptionsCount?: number | null;
  rubricGender?: string;
  selectedOptionsSlugs: string[];
}

export interface GetCatalogueAttributesPayloadInterface {
  selectedFilters: AttributeInterface[];
  castedAttributes: CatalogueFilterAttributeInterface[];
  selectedAttributes: CatalogueFilterAttributeInterface[];
}

interface CastOptionInterface {
  option: OptionInterface;
  attribute: RubricAttributeInterface;
}

interface CastOptionPayloadInterface {
  isSelected: boolean;
  optionSlug: string;
  castedOption: CatalogueFilterAttributeOptionInterface;
}

interface FilterSelectedOptionsInterface {
  option: OptionInterface;
  attributeSlug: string;
}

export async function getCatalogueAttributes({
  filters,
  locale,
  attributes,
  productsPrices,
  basePath,
  visibleOptionsCount,
  visibleAttributesCount,
  rubricGender,
  selectedOptionsSlugs,
}: GetCatalogueAttributesInterface): Promise<GetCatalogueAttributesPayloadInterface> {
  const { db } = await getDatabase();
  const optionsCollection = db.collection<OptionModel>(COL_OPTIONS);
  const selectedFilters: AttributeInterface[] = [];
  const castedAttributes: CatalogueFilterAttributeInterface[] = [];
  const selectedAttributes: CatalogueFilterAttributeInterface[] = [];

  const realFilter = filters.filter((filterItem) => {
    const filterItemArr = filterItem.split(FILTER_SEPARATOR);
    const filterName = filterItemArr[0];
    return filterName !== QUERY_FILTER_PAGE;
    // return filterName !== QUERY_FILTER_PAGE && filterName !== RUBRIC_KEY;
  });

  function filterOptionsList(options: (OptionInterface | null)[]): OptionInterface[] {
    const filteredNestedOptions = options.reduce((acc: OptionInterface[], option) => {
      if (option) {
        return [...acc, option];
      }
      return acc;
    }, []);
    return filteredNestedOptions;
  }

  function filterSelectedOptions({
    option,
    attributeSlug,
  }: FilterSelectedOptionsInterface): OptionInterface | null {
    const optionSlug = `${attributeSlug}${FILTER_SEPARATOR}${option.slug}`;
    const isSelected = realFilter.includes(optionSlug);
    const nestedOptions = (option.options || []).map((nestedOption) => {
      return filterSelectedOptions({
        option: nestedOption,
        attributeSlug,
      });
    });
    const filteredNestedOptions = filterOptionsList(nestedOptions);

    if (isSelected) {
      return {
        ...option,
        options: filteredNestedOptions,
      };
    }

    return null;
  }

  async function castOption({
    option,
    attribute,
  }: CastOptionInterface): Promise<CastOptionPayloadInterface> {
    // check if selected
    const optionSlug = `${attribute.slug}${FILTER_SEPARATOR}${option.slug}`;
    const isSelected = realFilter.includes(optionSlug);
    let optionName = getFieldStringLocale(option.nameI18n, locale);
    if (rubricGender) {
      const optionVariantGender = option.variants[rubricGender];
      if (optionVariantGender) {
        optionName = optionVariantGender[locale];
      }
      if (!optionName) {
        optionName = getFieldStringLocale(option.nameI18n, locale);
      }
    }

    const optionNextSlug = isSelected
      ? [...realFilter]
          .filter((pathArg) => {
            return pathArg !== optionSlug;
          })
          .join('/')
      : [...realFilter, optionSlug].join('/');

    const isCategory = attribute.slug === CATALOGUE_CATEGORY_KEY;
    const nestedOptions: CatalogueFilterAttributeOptionInterface[] = [];

    if (isCategory) {
      for await (const nestedOption of option.options || []) {
        const { castedOption } = await castOption({
          option: nestedOption,
          attribute,
        });
        nestedOptions.push(castedOption);
      }
    } else {
      const castedSelectedOptionsSlugs = selectedOptionsSlugs.map((slug) => {
        const slugParts = slug.split(FILTER_SEPARATOR);
        return slugParts[1];
      });
      const initialNestedOptions = await optionsCollection
        .aggregate([
          {
            $match: {
              parentId: option._id,
              slug: {
                $in: castedSelectedOptionsSlugs,
              },
            },
          },
        ])
        .toArray();

      for await (const nestedOption of initialNestedOptions) {
        const { castedOption } = await castOption({
          option: nestedOption,
          attribute,
        });
        nestedOptions.push(castedOption);
      }
    }

    const castedOption: CatalogueFilterAttributeOptionInterface = {
      _id: option._id,
      name: optionName,
      slug: option.slug,
      nextSlug: `${basePath}/${optionNextSlug}`,
      isSelected,
      options: nestedOptions,
    };

    return {
      castedOption,
      isSelected,
      optionSlug,
    };
  }

  for await (const attribute of attributes) {
    const { options, slug } = attribute;
    const castedOptions: CatalogueFilterAttributeOptionInterface[] = [];
    const selectedFilterOptions: CatalogueFilterAttributeOptionInterface[] = [];
    const selectedOptions: OptionInterface[] = [];

    for await (const option of options || []) {
      const { castedOption, optionSlug, isSelected } = await castOption({ option, attribute });

      // Push to the selected options list for catalogue title config and selected attributes view
      if (isSelected) {
        selectedOptions.push(option);
        selectedFilterOptions.push(castedOption);
      }

      // If price attribute
      if (slug === PRICE_ATTRIBUTE_SLUG) {
        const splittedOption = optionSlug.split(FILTER_SEPARATOR);
        const filterOptionValue = splittedOption[1];
        const prices = filterOptionValue.split('_');
        const minPrice = prices[0] ? noNaN(prices[0]) : null;
        const maxPrice = prices[1] ? noNaN(prices[1]) : null;

        if (!minPrice || !maxPrice) {
          continue;
        }

        const optionProduct = productsPrices.find(({ _id }) => {
          return noNaN(_id) >= minPrice && noNaN(_id) <= maxPrice;
        });

        if (optionProduct) {
          castedOptions.push(castedOption);
        }
      } else {
        castedOptions.push(castedOption);
      }
    }

    if (castedOptions.length < 1) {
      continue;
    }

    // attribute
    const otherSelectedValues = realFilter.filter((param) => {
      const castedParam = castCatalogueParamToObject(param);
      return castedParam.slug !== attribute.slug;
    });
    const clearSlug = `${basePath}/${otherSelectedValues.join('/')}`;

    const isSelected = castedOptions.some(({ isSelected }) => isSelected);

    const castedAttribute: CatalogueFilterAttributeInterface = {
      _id: attribute._id,
      attributeId: attribute.attributeId,
      clearSlug,
      slug: attribute.slug,
      name: getFieldStringLocale(attribute.nameI18n, locale),
      options: castedOptions,
      isSelected,
      totalOptionsCount: noNaN(attribute.totalOptionsCount),
      metric: attribute.metric ? getFieldStringLocale(attribute.metric.nameI18n, locale) : null,
      viewVariant: attribute.viewVariant,
      notShowAsAlphabet: attribute.notShowAsAlphabet || false,
      showAsCatalogueBreadcrumb: attribute.showAsCatalogueBreadcrumb,
    };

    if (isSelected) {
      selectedAttributes.push({
        ...castedAttribute,
        options: attribute.showNameInSelectedAttributes
          ? selectedFilterOptions.map((option) => {
              return {
                ...option,
                name: `${getFieldStringLocale(attribute.nameI18n, locale)} - ${option.name}`,
              };
            })
          : selectedFilterOptions,
      });

      // Add selected items to the catalogue title config
      const attributeSelectedOptions = selectedOptions.map((option) => {
        return filterSelectedOptions({
          option,
          attributeSlug: castedAttribute.slug,
        });
      });
      const attributeFilteredSelectedOptions = filterOptionsList(attributeSelectedOptions);
      selectedFilters.push({
        ...attribute,
        // options: selectedOptions,
        options: attributeFilteredSelectedOptions,
      });
    }

    // slice options if limit is specified
    const finalCastedAttribute = visibleOptionsCount
      ? {
          ...castedAttribute,
          options: castedAttribute.options.slice(0, visibleOptionsCount),
        }
      : castedAttribute;

    castedAttributes.push(finalCastedAttribute);
  }

  return {
    selectedFilters,
    castedAttributes: visibleAttributesCount
      ? castedAttributes.slice(0, visibleAttributesCount)
      : castedAttributes,
    selectedAttributes,
  };
}

interface CastOptionsForBreadcrumbsInterface {
  option: CatalogueFilterAttributeOptionInterface;
  attribute: CatalogueFilterAttributeInterface;
  metricValue: string;
  rubricSlug: string;
  acc: CatalogueBreadcrumbModel[];
}

function castOptionsForBreadcrumbs({
  option,
  attribute,
  rubricSlug,
  metricValue,
  acc,
}: CastOptionsForBreadcrumbsInterface): CatalogueBreadcrumbModel[] {
  const optionSlug = `${attribute.slug}${FILTER_SEPARATOR}${option.slug}`;
  const newAcc = [...acc];
  if (option.isSelected) {
    newAcc.push({
      _id: option._id,
      name: `${option.name}${metricValue}`,
      href: `${ROUTE_CATALOGUE}/${rubricSlug}/${optionSlug}`,
    });
  }

  if (!option.options || option.options.length < 1) {
    return newAcc;
  }

  return option.options.reduce((innerAcc: CatalogueBreadcrumbModel[], childOption) => {
    const castedOptionAcc = castOptionsForBreadcrumbs({
      option: childOption,
      attribute,
      rubricSlug,
      metricValue,
      acc: [],
    });
    return [...innerAcc, ...castedOptionAcc];
  }, newAcc);
}

interface GetCatalogueConfigsInterface {
  companySlug: string;
  city: string;
}

interface GetCatalogueConfigsPayloadInterface {
  visibleOptionsCount: number;
  snippetVisibleAttributesCount: number;
}

export async function getCatalogueConfigs({
  companySlug,
  city,
}: GetCatalogueConfigsInterface): Promise<GetCatalogueConfigsPayloadInterface> {
  const { db } = await getDatabase();
  const configsCollection = db.collection<ConfigModel>(COL_CONFIGS);
  const catalogueFilterVisibleOptionsCount = await configsCollection.findOne({
    slug: 'catalogueFilterVisibleOptionsCount',
    companySlug,
  });
  const visibleOptionsCount =
    noNaN(catalogueFilterVisibleOptionsCount?.cities[city][DEFAULT_LOCALE][0]) ||
    noNaN(CATALOGUE_FILTER_VISIBLE_OPTIONS);

  const snippetVisibleAttributesCountConfig = await configsCollection.findOne({
    slug: 'snippetAttributesCount',
    companySlug,
  });
  const snippetVisibleAttributesCount =
    noNaN(snippetVisibleAttributesCountConfig?.cities[city][DEFAULT_LOCALE][0]) ||
    noNaN(CATALOGUE_SNIPPET_VISIBLE_ATTRIBUTES);

  return {
    visibleOptionsCount,
    snippetVisibleAttributesCount,
  };
}

interface CastCatalogueFiltersPayloadInterface {
  minPrice?: number | null;
  maxPrice?: number | null;
  realFilterOptions: string[];
  categoryFilters: string[];
  sortBy: string | null;
  sortDir: 1 | -1;
  sortFilterOptions: string[];
  rubricSlug?: string[] | null;
  noFiltersSelected: boolean;
  page: number;
  skip: number;
  limit: number;
  clearSlug: string;
}

interface CastCatalogueFiltersInterface {
  filters: string[];
  initialLimit?: number;
  initialPage?: number;
}

export function castCatalogueFilters({
  filters,
  initialPage,
  initialLimit,
}: CastCatalogueFiltersInterface): CastCatalogueFiltersPayloadInterface {
  const realFilterOptions: string[] = [];
  const categoryFilters: string[] = [];
  let sortBy: string | null = null;
  let sortDir: string | null = null;

  // pagination
  const defaultPage = initialPage || DEFAULT_PAGE;
  let page = defaultPage;

  const defaultLimit = initialLimit || PAGINATION_DEFAULT_LIMIT;
  let limit = defaultLimit;

  // sort
  const sortFilterOptions: string[] = [];

  // prices
  let minPrice: number | null = null;
  let maxPrice: number | null = null;

  // rubrics
  const rubricSlug: string[] = [];

  filters.forEach((filterOption) => {
    const splittedOption = filterOption.split(FILTER_SEPARATOR);
    const filterAttributeSlug = splittedOption[0];
    const filterOptionSlug = splittedOption[1];
    if (filterAttributeSlug) {
      if (filterAttributeSlug === RUBRIC_KEY) {
        rubricSlug.push(filterOptionSlug);
        return;
      }

      if (filterAttributeSlug === QUERY_FILTER_PAGE) {
        page = noNaN(filterOptionSlug) || defaultPage;
        return;
      }

      if (filterAttributeSlug === CATALOGUE_FILTER_LIMIT) {
        limit = noNaN(filterOptionSlug) || defaultLimit;
        return;
      }

      if (filterAttributeSlug === PRICE_ATTRIBUTE_SLUG) {
        const prices = filterOptionSlug.split('_');
        minPrice = prices[0] ? noNaN(prices[0]) : null;
        maxPrice = prices[1] ? noNaN(prices[1]) : null;
        return;
      }

      if (filterAttributeSlug === SORT_BY_KEY) {
        sortFilterOptions.push(filterOption);
        sortBy = filterOptionSlug;
        return;
      }

      if (filterAttributeSlug === SORT_DIR_KEY) {
        sortFilterOptions.push(filterOption);
        sortDir = filterOptionSlug;
        return;
      }

      if (filterAttributeSlug === CATALOGUE_CATEGORY_KEY) {
        realFilterOptions.push(filterOptionSlug);
        categoryFilters.push(filterOption);
        return;
      }

      realFilterOptions.push(filterOption);
    }
  });

  const noFiltersSelected = realFilterOptions.length < 1;
  const castedSortDir = sortDir === SORT_DESC_STR ? SORT_DESC : SORT_ASC;
  const skip = page ? (page - 1) * limit : 0;
  const sortPathname = sortFilterOptions.length > 0 ? `/${sortFilterOptions.join('/')}` : '';

  return {
    rubricSlug: rubricSlug.length > 0 ? rubricSlug : null,
    clearSlug: sortPathname,
    minPrice,
    maxPrice,
    realFilterOptions,
    categoryFilters,
    sortBy,
    sortDir: castedSortDir,
    sortFilterOptions,
    noFiltersSelected,
    page,
    limit,
    skip,
  };
}

export interface GetCatalogueDataInterface {
  locale: string;
  city: string;
  companySlug?: string;
  companyId?: string | ObjectIdModel | null;
  snippetVisibleAttributesCount: number;
  visibleOptionsCount: number;
  input: {
    rubricSlug: string;
    filters: string[];
    page: number;
  };
}

export const getCatalogueData = async ({
  locale,
  city,
  input,
  companySlug = DEFAULT_COMPANY_SLUG,
  companyId,
  snippetVisibleAttributesCount,
  visibleOptionsCount,
}: GetCatalogueDataInterface): Promise<CatalogueDataInterface | null> => {
  try {
    // console.log(' ');
    // console.log('===========================================================');
    // const timeStart = new Date().getTime();
    const { db } = await getDatabase();
    const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
    const rubricsCollection = db.collection<RubricInterface>(COL_RUBRICS);
    const citiesCollection = db.collection<CityModel>(COL_CITIES);
    const countriesCollection = db.collection<CountryModel>(COL_COUNTRIES);

    // Get location configs
    const cityEntity = await citiesCollection.findOne({ slug: city });
    const country = await countriesCollection.findOne({
      citiesIds: cityEntity?._id,
    });
    const currency = country?.currency || DEFAULT_CURRENCY;

    // Args
    const { filters, page, rubricSlug } = input;
    const realCompanySlug = companySlug || DEFAULT_COMPANY_SLUG;

    // Cast selected filters
    const {
      minPrice,
      maxPrice,
      realFilterOptions,
      sortBy,
      sortDir,
      sortFilterOptions,
      noFiltersSelected,
      skip,
      limit,
      categoryFilters,
      page: payloadPage,
    } = castCatalogueFilters({
      filters,
      initialPage: page,
      initialLimit: CATALOGUE_PRODUCTS_LIMIT,
    });

    const pricesStage =
      minPrice && maxPrice
        ? {
            price: {
              $gte: minPrice,
              $lte: maxPrice,
            },
          }
        : {};

    const optionsStage = noFiltersSelected
      ? {}
      : {
          selectedOptionsSlugs: {
            $all: realFilterOptions,
          },
        };

    const companyRubricsMatch = companyId ? { companyId: new ObjectId(companyId) } : {};

    const productsInitialMatch = {
      ...companyRubricsMatch,
      rubricSlug,
      citySlug: city,
      ...optionsStage,
      ...pricesStage,
    };

    // sort stage
    let sortStage: any = {
      priorities: SORT_DESC,
      views: SORT_DESC,
      available: SORT_DESC,
      _id: SORT_DESC,
    };

    // sort by price
    if (sortBy === SHOP_PRODUCTS_DEFAULT_SORT_BY_KEY) {
      sortStage = {
        minPrice: sortDir,
        priorities: SORT_DESC,
        views: SORT_DESC,
        available: SORT_DESC,
        _id: SORT_DESC,
      };
    }

    const rubricsPipeline = getCatalogueRubricPipeline({
      city,
      companySlug,
      viewVariant: 'filter',
    });

    // const shopProductsStart = new Date().getTime();
    const shopProductsAggregation = await shopProductsCollection
      .aggregate<CatalogueProductsAggregationInterface>(
        [
          {
            $match: { ...productsInitialMatch },
          },
          {
            $unwind: {
              path: '$selectedOptionsSlugs',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $group: {
              _id: '$productId',
              itemId: { $first: '$itemId' },
              rubricId: { $first: '$rubricId' },
              rubricSlug: { $first: `$rubricSlug` },
              slug: { $first: '$slug' },
              gender: { $first: '$gender' },
              mainImage: { $first: `$mainImage` },
              originalName: { $first: `$originalName` },
              nameI18n: { $first: `$nameI18n` },
              titleCategoriesSlugs: { $first: `$titleCategoriesSlugs` },
              views: { $max: `$views.${realCompanySlug}.${city}` },
              priorities: { $max: `$priorities.${realCompanySlug}.${city}` },
              minPrice: {
                $min: '$price',
              },
              maxPrice: {
                $min: '$price',
              },
              available: {
                $max: '$available',
              },
              selectedOptionsSlugs: {
                $addToSet: '$selectedOptionsSlugs',
              },
              shopsIds: {
                $addToSet: '$shopId',
              },
              shopProductsIds: {
                $addToSet: '$_id',
              },
            },
          },
          {
            $facet: {
              docs: [
                {
                  $sort: {
                    ...sortStage,
                  },
                },
                {
                  $skip: skip,
                },
                {
                  $limit: limit,
                },
                {
                  $addFields: {
                    shopsCount: { $size: '$shopsIds' },
                    cardPrices: {
                      min: '$minPrice',
                      max: '$maxPrice',
                    },
                  },
                },

                // Lookup product connection
                ...productConnectionsPipeline(city),

                // Lookup product attributes
                ...productAttributesPipeline,

                // Lookup product categories
                ...productCategoriesPipeline(),
              ],

              // get prices list
              prices: [
                {
                  $group: {
                    _id: '$minPrice',
                  },
                },
              ],

              // get catalogue categories
              categories: [
                {
                  $unwind: {
                    path: '$selectedOptionsSlugs',
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $group: {
                    _id: null,
                    rubricId: { $first: '$rubricId' },
                    selectedOptionsSlugs: {
                      $addToSet: '$selectedOptionsSlugs',
                    },
                  },
                },
                ...productCategoriesPipeline(),
                {
                  $addFields: {
                    views: { $max: `$views.${realCompanySlug}.${city}` },
                    priorities: { $max: `$priorities.${realCompanySlug}.${city}` },
                  },
                },
                {
                  $sort: {
                    priorities: SORT_DESC,
                    views: SORT_DESC,
                    _id: SORT_DESC,
                  },
                },
                {
                  $unwind: {
                    path: '$categories',
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $match: {
                    categories: {
                      $exists: true,
                    },
                  },
                },
                {
                  $replaceRoot: {
                    newRoot: '$categories',
                  },
                },
              ],
              countAllDocs: [
                {
                  $count: 'totalDocs',
                },
              ],

              rubric: rubricsPipeline,

              selectedOptionsSlugs: [
                {
                  $unwind: {
                    path: '$selectedOptionsSlugs',
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $group: {
                    _id: null,
                    slugs: {
                      $addToSet: '$selectedOptionsSlugs',
                    },
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              totalDocsObject: { $arrayElemAt: ['$countAllDocs', 0] },
              rubric: { $arrayElemAt: ['$rubric', 0] },
              selectedOptionsSlugs: { $arrayElemAt: ['$selectedOptionsSlugs', 0] },
            },
          },
          {
            $addFields: {
              totalProducts: '$totalDocsObject.totalDocs',
              selectedOptionsSlugs: '$selectedOptionsSlugs.slugs',
            },
          },
          {
            $project: {
              docs: 1,
              categories: 1,
              totalProducts: 1,
              prices: 1,
              rubric: 1,
              selectedOptionsSlugs: 1,
            },
          },
        ],
        { allowDiskUse: true },
      )
      .toArray();
    const shopProductsAggregationResult = shopProductsAggregation[0];

    // console.log(shopProductsAggregationResult);
    // console.log(shopProductsAggregationResult.docs[0]);
    // console.log(JSON.stringify(shopProductsAggregationResult.rubric, null, 2));
    // console.log(`Shop products >>>>>>>>>>>>>>>> `, new Date().getTime() - shopProductsStart);
    if (!shopProductsAggregationResult) {
      return null;
    }

    // Get catalogue rubric
    let rubric: RubricInterface | null = shopProductsAggregationResult.rubric;
    if (!rubric) {
      rubric = await rubricsCollection.findOne({
        slug: rubricSlug,
      });
    }
    if (!rubric) {
      return {
        _id: new ObjectId(),
        clearSlug: `${ROUTE_CATALOGUE}/${rubricSlug}`,
        filters,
        rubricName: rubricSlug,
        rubricSlug,
        products: [],
        catalogueTitle: 'Товары не найдены',
        catalogueFilterLayout: DEFAULT_LAYOUT,
        totalProducts: 0,
        attributes: [],
        selectedAttributes: [],
        breadcrumbs: [],
        page: 1,
      };
    }

    // Get filter attributes
    // const beforeOptions = new Date().getTime();
    const priceAttribute = getPriceAttribute();
    let categoryAttribute: RubricAttributeInterface[] = [];
    const showCategoriesInFilter = Boolean(rubric.variant?.showCategoriesInFilter);
    if (
      shopProductsAggregationResult.categories &&
      shopProductsAggregationResult.categories.length > 0
    ) {
      categoryAttribute = [
        getCategoryFilterAttribute({
          locale,
          categories: shopProductsAggregationResult.categories,
        }),
      ];
    }

    const { selectedFilters, castedAttributes, selectedAttributes } = await getCatalogueAttributes({
      attributes: [priceAttribute, ...categoryAttribute, ...(rubric.attributes || [])],
      locale,
      filters,
      selectedOptionsSlugs: shopProductsAggregationResult.selectedOptionsSlugs,
      productsPrices: shopProductsAggregationResult.prices,
      basePath: `${ROUTE_CATALOGUE}/${rubricSlug}`,
      visibleOptionsCount,
      rubricGender: rubric.catalogueTitle.gender,
      // visibleAttributesCount,
    });
    // console.log('Options >>>>>>>>>>>>>>>> ', new Date().getTime() - beforeOptions);

    // Get catalogue products
    const products = [];
    const rubricListViewAttributes = castedAttributes.filter(({ viewVariant }) => {
      return viewVariant === ATTRIBUTE_VIEW_VARIANT_LIST;
    });

    for await (const product of shopProductsAggregationResult.docs) {
      // prices
      const { attributes, connections, ...restProduct } = product;
      const minPrice = noNaN(product.cardPrices?.min);
      const maxPrice = noNaN(product.cardPrices?.max);
      const cardPrices = {
        _id: new ObjectId(),
        min: `${minPrice}`,
        max: `${maxPrice}`,
      };

      const categories = getTreeFromList({
        list: product.categories,
        childrenFieldName: 'categories',
        locale,
      });

      // title
      const snippetTitle = generateSnippetTitle({
        locale,
        rubricName: getFieldStringLocale(rubric.nameI18n, locale),
        showRubricNameInProductTitle: rubric.showRubricNameInProductTitle,
        showCategoryInProductTitle: rubric.showCategoryInProductTitle,
        attributes: attributes || [],
        categories,
        titleCategoriesSlugs: restProduct.titleCategoriesSlugs,
        fallbackTitle: restProduct.originalName,
        defaultKeyword: restProduct.originalName,
        defaultGender: restProduct.gender,
      });

      // listFeatures
      const initialListFeatures = getProductCurrentViewCastedAttributes({
        attributes: attributes || [],
        viewVariant: ATTRIBUTE_VIEW_VARIANT_LIST,
        locale,
      });

      const visibleListFeatures = initialListFeatures.filter(({ showInSnippet }) => {
        return showInSnippet;
      });

      const initialListFeaturesWithIndex = visibleListFeatures.map((listAttribute) => {
        const indexInRubric = rubricListViewAttributes.findIndex(
          ({ slug }) => slug === listAttribute.slug,
        );
        const finalIndexInRubric = indexInRubric < 0 ? 0 : indexInRubric;
        const index = rubricListViewAttributes.length - finalIndexInRubric;
        return {
          ...listAttribute,
          index,
        };
      });
      const sortedListAttributes = initialListFeaturesWithIndex.sort(
        (listAttributeA, listAttributeB) => {
          return noNaN(listAttributeB.index) - noNaN(listAttributeA.index);
        },
      );
      const listFeatures = sortedListAttributes.slice(0, snippetVisibleAttributesCount);

      // ratingFeatures
      const ratingFeatures = getProductCurrentViewCastedAttributes({
        attributes: attributes || [],
        viewVariant: ATTRIBUTE_VIEW_VARIANT_OUTER_RATING,
        locale,
      });

      const visibleRatingFeatures = ratingFeatures.filter(({ showInSnippet }) => {
        return showInSnippet;
      });

      const castedConnections = (connections || []).reduce(
        (acc: ProductConnectionInterface[], { attribute, ...connection }) => {
          const connectionProducts = (connection.connectionProducts || []).reduce(
            (acc: ProductConnectionItemInterface[], connectionProduct) => {
              if (!connectionProduct.shopProduct) {
                return acc;
              }

              return [
                ...acc,
                {
                  ...connectionProduct,
                  option: connectionProduct.option
                    ? {
                        ...connectionProduct.option,
                        name: getFieldStringLocale(connectionProduct.option?.nameI18n, locale),
                      }
                    : null,
                },
              ];
            },
            [],
          );

          if (connectionProducts.length < 1 || !attribute) {
            return acc;
          }

          return [
            ...acc,
            {
              ...connection,
              connectionProducts,
              attribute: {
                ...attribute,
                name: getFieldStringLocale(attribute?.nameI18n, locale),
                metric: attribute.metric
                  ? {
                      ...attribute.metric,
                      name: getFieldStringLocale(attribute.metric.nameI18n, locale),
                    }
                  : null,
              },
            },
          ];
        },
        [],
      );

      products.push({
        ...restProduct,
        listFeatures,
        ratingFeatures: visibleRatingFeatures,
        name: getFieldStringLocale(product.nameI18n, locale),
        cardPrices,
        connections: castedConnections,
        snippetTitle,
      });
    }

    // Get catalogue title
    const catalogueTitle = generateTitle({
      positionFieldName: 'positioningInTitle',
      attributeNameVisibilityFieldName: 'showNameInTitle',
      attributeVisibilityFieldName: 'showInCatalogueTitle',
      defaultGender: rubric.catalogueTitle.gender,
      fallbackTitle: getFieldStringLocale(rubric.catalogueTitle.defaultTitleI18n, locale),
      defaultKeyword: getFieldStringLocale(rubric.catalogueTitle.keywordI18n, locale),
      prefix: getFieldStringLocale(rubric.catalogueTitle.prefixI18n, locale),
      attributes: selectedFilters,
      capitaliseKeyWord: rubric.capitalise,
      locale,
      currency,
    });

    const sortPathname = sortFilterOptions.length > 0 ? `/${sortFilterOptions.join('/')}` : '';
    // console.log('Total time: ', new Date().getTime() - timeStart);

    // final filter attributes
    const finalAttributes = showCategoriesInFilter
      ? castedAttributes
      : castedAttributes.filter(({ slug }) => {
          return slug !== CATALOGUE_CATEGORY_KEY;
        });

    // get catalogue breadcrumbs
    const rubricName = getFieldStringLocale(rubric.nameI18n, locale);
    const breadcrumbs: CatalogueBreadcrumbModel[] = [
      {
        _id: rubric._id,
        name: rubricName,
        href: `${ROUTE_CATALOGUE}/${rubricSlug}`,
      },
    ];

    selectedAttributes.forEach((selectedAttribute) => {
      const { options, showAsCatalogueBreadcrumb, slug } = selectedAttribute;
      const isPrice = slug === PRICE_ATTRIBUTE_SLUG;
      let metricValue = selectedAttribute.metric ? ` ${selectedAttribute.metric}` : '';
      if (isPrice) {
        metricValue = currency;
      }

      if (showAsCatalogueBreadcrumb || isPrice) {
        const optionBreadcrumbs = options.reduce((acc: CatalogueBreadcrumbModel[], option) => {
          const tree = castOptionsForBreadcrumbs({
            option: option,
            attribute: selectedAttribute,
            rubricSlug,
            metricValue,
            acc: [],
          });
          return [...acc, ...tree];
        }, []);

        optionBreadcrumbs.forEach((options) => {
          breadcrumbs.push(options);
        });
      }
    });

    // get clearSlug
    let clearSlug = `${rubricSlug}/${sortPathname}`;
    if (!rubric.variant?.showCategoriesInFilter) {
      const clearPath = [rubricSlug, ...categoryFilters, sortPathname]
        .filter((pathPart) => {
          return pathPart;
        })
        .join('/');
      clearSlug = `${clearPath}`;
    }

    return {
      _id: rubric._id,
      clearSlug,
      filters,
      rubricName,
      rubricSlug: rubric.slug,
      products,
      catalogueTitle,
      catalogueFilterLayout: rubric.variant?.catalogueFilterLayout || DEFAULT_LAYOUT,
      totalProducts: noNaN(shopProductsAggregationResult.totalProducts),
      attributes: finalAttributes,
      selectedAttributes: showCategoriesInFilter
        ? selectedAttributes
        : selectedAttributes.filter(({ slug }) => {
            return slug !== CATALOGUE_CATEGORY_KEY;
          }),
      page: payloadPage,
      breadcrumbs,
      rubricVariant: rubric.variant,
    };
  } catch (e) {
    console.log(e);
    return null;
  }
};

export async function getCatalogueServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CatalogueInterface>> {
  // console.log(' ');
  // console.log('=================== Catalogue getServerSideProps =======================');
  // const timeStart = new Date().getTime();

  const { query } = context;
  const { props } = await getSiteInitialData({
    context,
  });
  const { catalogue, rubricSlug } = query;

  const notFoundResponse = {
    props: {
      ...props,
      route: '',
    },
    notFound: true,
  };

  if (!rubricSlug) {
    return notFoundResponse;
  }

  // catalogue
  const rawCatalogueData = await getCatalogueData({
    locale: props.sessionLocale,
    city: props.sessionCity,
    companySlug: props.company?.slug,
    companyId: props.company?._id,
    snippetVisibleAttributesCount: props.initialData.configs.snippetAttributesCount,
    visibleOptionsCount: props.initialData.configs.catalogueFilterVisibleOptionsCount,
    input: {
      rubricSlug: `${rubricSlug}`,
      filters: alwaysArray(catalogue),
      page: 1,
    },
  });

  if (!rawCatalogueData) {
    return notFoundResponse;
  }

  // console.log('Catalogue getServerSideProps total time ', new Date().getTime() - timeStart);

  return {
    props: {
      ...props,
      route: '',
      catalogueData: castDbData(rawCatalogueData),
    },
  };
}
