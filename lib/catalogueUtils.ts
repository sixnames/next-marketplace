import { CatalogueInterface } from 'components/Catalogue';
import { getPriceAttribute } from 'config/constantAttributes';
import {
  COL_ATTRIBUTES,
  COL_CITIES,
  COL_CONFIGS,
  COL_COUNTRIES,
  COL_OPTIONS,
  COL_PRODUCT_ATTRIBUTES,
  COL_PRODUCT_CONNECTION_ITEMS,
  COL_PRODUCT_CONNECTIONS,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
} from 'db/collectionNames';
import { getCatalogueRubricPipeline } from 'db/constantPipelines';
import {
  AttributeViewVariantModel,
  CatalogueBreadcrumbModel,
  CityModel,
  ConfigModel,
  CountryModel,
  GenderModel,
  ObjectIdModel,
  RubricCatalogueTitleModel,
  ShopProductModel,
} from 'db/dbModels';
import {
  ATTRIBUTE_POSITION_IN_TITLE_AFTER_KEYWORD,
  ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD,
  ATTRIBUTE_POSITION_IN_TITLE_BEGIN,
  ATTRIBUTE_POSITION_IN_TITLE_END,
  ATTRIBUTE_POSITION_IN_TITLE_REPLACE_KEYWORD,
  ATTRIBUTE_VIEW_VARIANT_LIST,
  ATTRIBUTE_VIEW_VARIANT_OUTER_RATING,
  CATALOGUE_FILTER_LIMIT,
  QUERY_FILTER_PAGE,
  CATALOGUE_FILTER_VISIBLE_OPTIONS,
  CATALOGUE_OPTION_SEPARATOR,
  CATALOGUE_PRODUCTS_LIMIT,
  CATALOGUE_SNIPPET_VISIBLE_ATTRIBUTES,
  DEFAULT_COMPANY_SLUG,
  DEFAULT_LOCALE,
  LOCALE_NOT_FOUND_FIELD_MESSAGE,
  PAGINATION_DEFAULT_LIMIT,
  PRICE_ATTRIBUTE_SLUG,
  ROUTE_CATALOGUE,
  SHOP_PRODUCTS_DEFAULT_SORT_BY_KEY,
  SORT_ASC,
  SORT_BY_KEY,
  SORT_DESC,
  SORT_DESC_STR,
  SORT_DIR_KEY,
  PAGE_DEFAULT,
  RUBRIC_KEY,
  DEFAULT_CURRENCY,
} from 'config/common';
import { getDatabase } from 'db/mongodb';
import {
  CatalogueDataInterface,
  CatalogueFilterAttributeInterface,
  CatalogueFilterAttributeOptionInterface,
  CatalogueProductPricesInterface,
  CatalogueProductsAggregationInterface,
  ProductConnectionInterface,
  ProductConnectionItemInterface,
  RubricAttributeInterface,
  RubricInterface,
  RubricOptionInterface,
} from 'db/uiInterfaces';
import { alwaysArray } from 'lib/arrayUtils';
import { getFieldStringLocale } from 'lib/i18n';
import { noNaN } from 'lib/numbers';
import { getProductCurrentViewCastedAttributes } from 'lib/productAttributesUtils';
import { getConstantTranslation } from 'config/constantTranslations';
import { castDbData, getSiteInitialData } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import capitalize from 'capitalize';
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

export interface SelectedFilterInterface {
  attribute: RubricAttributeInterface;
  options: RubricOptionInterface[];
}

interface GetCatalogueTitleInterface {
  selectedFilters: SelectedFilterInterface[];
  rubricCatalogueTitleConfig: RubricCatalogueTitleModel;
  locale: string;
  currency: string;
  capitaliseKeyWord?: boolean | null;
}

export function getCatalogueTitle({
  selectedFilters,
  rubricCatalogueTitleConfig,
  locale,
  currency,
  capitaliseKeyWord,
}: GetCatalogueTitleInterface): string {
  const {
    gender: rubricGender,
    defaultTitleI18n,
    keywordI18n,
    prefixI18n,
  } = rubricCatalogueTitleConfig;

  function castArrayToTitle(arr: any[]): string {
    const filteredArray = arr.filter((word) => word);
    const firstWord = filteredArray[0];
    const otherWords = filteredArray.slice(1);
    return [capitalize(firstWord), ...otherWords].join(' ');
  }

  // Return default rubric title if no filters selected
  if (selectedFilters.length < 1) {
    return getFieldStringLocale(defaultTitleI18n, locale);
  }

  const titleSeparator = getConstantTranslation(`catalogueTitleSeparator.${locale}`);
  const rubricKeywordTranslation = getFieldStringLocale(keywordI18n, locale);
  const rubricKeyword =
    rubricKeywordTranslation === LOCALE_NOT_FOUND_FIELD_MESSAGE
      ? ''
      : capitaliseKeyWord
      ? rubricKeywordTranslation
      : rubricKeywordTranslation.toLowerCase();

  const finalPrefixTranslation = getFieldStringLocale(prefixI18n, locale);
  const finalPrefix =
    finalPrefixTranslation === LOCALE_NOT_FOUND_FIELD_MESSAGE ? '' : finalPrefixTranslation;

  const beginOfTitle: string[] = [];
  const beforeKeyword: string[] = [];
  const afterKeyword: string[] = [];
  const endOfTitle: string[] = [];
  let finalKeyword = rubricKeyword;
  let finalGender = rubricGender;

  // Set keyword gender
  selectedFilters.forEach((selectedFilter) => {
    const { attribute, options } = selectedFilter;
    const { positioningInTitle } = attribute;
    const positionInTitleForCurrentLocale = getFieldStringLocale(positioningInTitle, locale);
    const gendersList = options.reduce((genderAcc: GenderModel[], { gender }) => {
      if (
        gender &&
        positionInTitleForCurrentLocale === ATTRIBUTE_POSITION_IN_TITLE_REPLACE_KEYWORD
      ) {
        return [...genderAcc, gender];
      }
      return genderAcc;
    }, []);

    if (gendersList.length > 0 && gendersList[0]) {
      finalGender = gendersList[0];
    }
  });

  // Collect title parts
  selectedFilters.forEach((selectedFilter) => {
    const { attribute, options } = selectedFilter;
    const isPrice = attribute.slug === PRICE_ATTRIBUTE_SLUG;
    const { positioningInTitle, metric, showNameInTitle } = attribute;
    const attributeName = showNameInTitle
      ? `${getFieldStringLocale(attribute.nameI18n, locale)} `
      : '';
    const positionInTitleForCurrentLocale = getFieldStringLocale(positioningInTitle, locale);
    let metricValue = metric ? ` ${getFieldStringLocale(metric.nameI18n, locale)}` : '';
    if (isPrice) {
      metricValue = currency;
    }

    const value = options
      .map(({ variants, nameI18n }) => {
        const name = getFieldStringLocale(nameI18n, locale);
        const currentVariant = variants[finalGender];
        const variantLocale = currentVariant ? getFieldStringLocale(currentVariant, locale) : null;
        let value = name;
        if (variantLocale && variantLocale !== LOCALE_NOT_FOUND_FIELD_MESSAGE) {
          value = variantLocale;
        }
        const optionValue = `${attributeName}${value}${metricValue}`;
        return attribute.capitalise ? optionValue : optionValue.toLocaleLowerCase();
      })
      .join(titleSeparator);

    if (isPrice) {
      endOfTitle.push(value);
      return;
    }
    if (positionInTitleForCurrentLocale === ATTRIBUTE_POSITION_IN_TITLE_BEGIN) {
      beginOfTitle.push(value);
    }
    if (positionInTitleForCurrentLocale === ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD) {
      beforeKeyword.push(value);
    }
    if (positionInTitleForCurrentLocale === ATTRIBUTE_POSITION_IN_TITLE_REPLACE_KEYWORD) {
      const keywordValue = capitaliseKeyWord ? value : value.toLowerCase();
      if (finalKeyword === rubricKeyword) {
        finalKeyword = keywordValue;
      } else {
        finalKeyword = finalKeyword + titleSeparator + keywordValue;
      }
    }
    if (positionInTitleForCurrentLocale === ATTRIBUTE_POSITION_IN_TITLE_AFTER_KEYWORD) {
      afterKeyword.push(value);
    }
    if (positionInTitleForCurrentLocale === ATTRIBUTE_POSITION_IN_TITLE_END) {
      endOfTitle.push(value);
    }
  });

  return castArrayToTitle([
    finalPrefix,
    ...beginOfTitle,
    ...beforeKeyword,
    finalKeyword,
    ...afterKeyword,
    ...endOfTitle,
  ]);
}

export interface GetRubricCatalogueOptionsInterface {
  options: RubricOptionInterface[];
  // maxVisibleOptions: number;
  visibleOptionsSlugs: string[];
  city: string;
}

export function getRubricCatalogueOptions({
  options,
  // maxVisibleOptions,
  visibleOptionsSlugs,
  city,
}: GetRubricCatalogueOptionsInterface): RubricOptionInterface[] {
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
    const filterItemArr = filterItem.split(CATALOGUE_OPTION_SEPARATOR);
    const filterName = filterItemArr[0];
    return filterName !== QUERY_FILTER_PAGE;
  });

  rubrics.forEach((rubric) => {
    const optionSlug = `${RUBRIC_KEY}${CATALOGUE_OPTION_SEPARATOR}${rubric.slug}`;
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
}

export interface GetCatalogueAttributesPayloadInterface {
  selectedFilters: SelectedFilterInterface[];
  castedAttributes: CatalogueFilterAttributeInterface[];
  selectedAttributes: CatalogueFilterAttributeInterface[];
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
}: GetCatalogueAttributesInterface): Promise<GetCatalogueAttributesPayloadInterface> {
  const selectedFilters: SelectedFilterInterface[] = [];
  const castedAttributes: CatalogueFilterAttributeInterface[] = [];
  const selectedAttributes: CatalogueFilterAttributeInterface[] = [];

  const realFilter = filters.filter((filterItem) => {
    const filterItemArr = filterItem.split(CATALOGUE_OPTION_SEPARATOR);
    const filterName = filterItemArr[0];
    return filterName !== QUERY_FILTER_PAGE;
    // return filterName !== QUERY_FILTER_PAGE && filterName !== RUBRIC_KEY;
  });

  for await (const attribute of attributes) {
    const { options, slug } = attribute;
    const castedOptions: CatalogueFilterAttributeOptionInterface[] = [];
    const selectedFilterOptions: CatalogueFilterAttributeOptionInterface[] = [];
    const selectedOptions: RubricOptionInterface[] = [];

    for await (const option of options || []) {
      // check if selected
      const optionSlug = `${attribute.slug}${CATALOGUE_OPTION_SEPARATOR}${option.slug}`;
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

      const castedOption = {
        _id: option._id,
        name: optionName,
        slug: option.slug,
        nextSlug: `${basePath}/${optionNextSlug}`,
        isSelected,
      };

      // Push to the selected options list for catalogue title config and selected attributes view
      if (isSelected) {
        selectedOptions.push(option);
        selectedFilterOptions.push(castedOption);
      }

      // If price attribute
      if (slug === PRICE_ATTRIBUTE_SLUG) {
        const splittedOption = optionSlug.split(CATALOGUE_OPTION_SEPARATOR);
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
        continue;
      }

      castedOptions.push(castedOption);
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
        options: attribute.showNameInTitle
          ? selectedFilterOptions.map((option) => {
              return {
                ...option,
                name: `${getFieldStringLocale(attribute.nameI18n, locale)} ${option.name}`,
              };
            })
          : selectedFilterOptions,
      });

      // Add selected items to the catalogue title config
      selectedFilters.push({
        attribute: {
          ...attribute,
          options: [],
        },
        options: selectedOptions,
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
  let sortBy: string | null = null;
  let sortDir: string | null = null;

  // pagination
  const defaultPage = initialPage || PAGE_DEFAULT;
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
    const splittedOption = filterOption.split(CATALOGUE_OPTION_SEPARATOR);
    const filterOptionName = splittedOption[0];
    const filterOptionValue = splittedOption[1];
    if (filterOptionName) {
      if (filterOptionName === RUBRIC_KEY) {
        rubricSlug.push(filterOptionValue);
        return;
      }

      if (filterOptionName === QUERY_FILTER_PAGE) {
        page = noNaN(filterOptionValue) || defaultPage;
        return;
      }

      if (filterOptionName === CATALOGUE_FILTER_LIMIT) {
        limit = noNaN(filterOptionValue) || defaultLimit;
        return;
      }

      if (filterOptionName === PRICE_ATTRIBUTE_SLUG) {
        const prices = filterOptionValue.split('_');
        minPrice = prices[0] ? noNaN(prices[0]) : null;
        maxPrice = prices[1] ? noNaN(prices[1]) : null;
        return;
      }

      if (filterOptionName === SORT_BY_KEY) {
        sortFilterOptions.push(filterOption);
        sortBy = filterOptionValue;
        return;
      }

      if (filterOptionName === SORT_DIR_KEY) {
        sortFilterOptions.push(filterOption);
        sortDir = filterOptionValue;
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

    // Get configs
    // const configsTimeStart = new Date().getTime();
    const { snippetVisibleAttributesCount, visibleOptionsCount } = await getCatalogueConfigs({
      companySlug: realCompanySlug,
      city,
    });
    // console.log('Configs >>>>>>>>>>>>>>>> ', new Date().getTime() - configsTimeStart);

    // Cast selected options
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
              mainImage: { $first: `$mainImage` },
              originalName: { $first: `$originalName` },
              nameI18n: { $first: `$nameI18n` },
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
                {
                  $lookup: {
                    from: COL_PRODUCT_CONNECTIONS,
                    as: 'connections',
                    let: {
                      productId: '$_id',
                    },
                    pipeline: [
                      {
                        $match: {
                          $expr: {
                            $in: ['$$productId', '$productsIds'],
                          },
                        },
                      },
                      {
                        $lookup: {
                          from: COL_ATTRIBUTES,
                          as: 'attribute',
                          let: { attributeId: '$attributeId' },
                          pipeline: [
                            {
                              $match: {
                                $expr: {
                                  $eq: ['$$attributeId', '$_id'],
                                },
                              },
                            },
                          ],
                        },
                      },
                      {
                        $addFields: {
                          attribute: {
                            $arrayElemAt: ['$attribute', 0],
                          },
                        },
                      },
                      {
                        $lookup: {
                          from: COL_PRODUCT_CONNECTION_ITEMS,
                          as: 'connectionProducts',
                          let: {
                            connectionId: '$_id',
                          },
                          pipeline: [
                            {
                              $match: {
                                $expr: {
                                  $eq: ['$connectionId', '$$connectionId'],
                                },
                              },
                            },
                            {
                              $lookup: {
                                from: COL_OPTIONS,
                                as: 'option',
                                let: { optionId: '$optionId' },
                                pipeline: [
                                  {
                                    $match: {
                                      $expr: {
                                        $eq: ['$$optionId', '$_id'],
                                      },
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              $lookup: {
                                from: COL_SHOP_PRODUCTS,
                                as: 'shopProduct',
                                let: { productId: '$productId' },
                                pipeline: [
                                  {
                                    $match: {
                                      $expr: {
                                        $eq: ['$$productId', '$productId'],
                                      },
                                      citySlug: city,
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              $addFields: {
                                option: {
                                  $arrayElemAt: ['$option', 0],
                                },
                                shopProduct: {
                                  $arrayElemAt: ['$shopProduct', 0],
                                },
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },

                // Lookup product attributes
                {
                  $lookup: {
                    from: COL_PRODUCT_ATTRIBUTES,
                    as: 'attributes',
                    let: {
                      productId: '$_id',
                    },
                    pipeline: [
                      {
                        $match: {
                          $expr: {
                            $eq: ['$$productId', '$productId'],
                          },
                          viewVariant: {
                            $in: [ATTRIBUTE_VIEW_VARIANT_LIST, ATTRIBUTE_VIEW_VARIANT_OUTER_RATING],
                          },
                        },
                      },
                      {
                        $lookup: {
                          from: COL_OPTIONS,
                          as: 'options',
                          let: {
                            optionsGroupId: '$optionsGroupId',
                            selectedOptionsIds: '$selectedOptionsIds',
                          },
                          pipeline: [
                            {
                              $match: {
                                $expr: {
                                  $and: [
                                    {
                                      $eq: ['$optionsGroupId', '$$optionsGroupId'],
                                    },
                                    {
                                      $in: ['$_id', '$$selectedOptionsIds'],
                                    },
                                  ],
                                },
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
              prices: [
                {
                  $group: {
                    _id: '$minPrice',
                  },
                },
              ],
              countAllDocs: [
                {
                  $count: 'totalDocs',
                },
              ],
              rubric: rubricsPipeline,
            },
          },
          {
            $addFields: {
              totalDocsObject: { $arrayElemAt: ['$countAllDocs', 0] },
              rubric: { $arrayElemAt: ['$rubric', 0] },
            },
          },
          {
            $addFields: {
              totalProducts: '$totalDocsObject.totalDocs',
            },
          },
          {
            $project: {
              docs: 1,
              totalProducts: 1,
              options: 1,
              prices: 1,
              rubric: 1,
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
        totalProducts: 0,
        attributes: [],
        selectedAttributes: [],
        breadcrumbs: [],
        page: 1,
      };
    }

    // Get filter attributes
    // const beforeOptions = new Date().getTime();
    const { selectedFilters, castedAttributes, selectedAttributes } = await getCatalogueAttributes({
      attributes: [getPriceAttribute(), ...(rubric.attributes || [])],
      locale,
      filters,
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
      });
    }

    // Get catalogue title
    const catalogueTitle = getCatalogueTitle({
      rubricCatalogueTitleConfig: rubric.catalogueTitle,
      selectedFilters,
      locale,
      currency,
      capitaliseKeyWord: rubric.capitalise,
    });

    const sortPathname = sortFilterOptions.length > 0 ? `/${sortFilterOptions.join('/')}` : '';
    // console.log('Total time: ', new Date().getTime() - timeStart);

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
        options.forEach((selectedOption) => {
          breadcrumbs.push({
            _id: selectedOption._id,
            name: `${selectedOption.name}${metricValue}`,
            href: `${ROUTE_CATALOGUE}/${rubricSlug}/${selectedAttribute.slug}${CATALOGUE_OPTION_SEPARATOR}${selectedOption.slug}`,
          });
        });
      }
    });

    return {
      _id: rubric._id,
      clearSlug: `${ROUTE_CATALOGUE}/${rubricSlug}/${sortPathname}`,
      filters,
      rubricName,
      rubricSlug: rubric.slug,
      products,
      catalogueTitle,
      totalProducts: noNaN(shopProductsAggregationResult.totalProducts),
      attributes: castedAttributes,
      selectedAttributes,
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
