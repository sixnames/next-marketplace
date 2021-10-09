import { CatalogueInterface } from 'components/Catalogue';
import {
  getRubricFilterAttribute,
  getBrandFilterAttribute,
  getCategoryFilterAttribute,
  getPriceAttribute,
} from 'config/constantAttributes';
import {
  DEFAULT_LAYOUT,
  GRID_SNIPPET_LAYOUT_BIG_IMAGE,
  ROW_SNIPPET_LAYOUT_BIG_IMAGE,
} from 'config/constantSelects';
import {
  COL_BRAND_COLLECTIONS,
  COL_BRANDS,
  COL_CATEGORIES,
  COL_CONFIGS,
  COL_PRODUCT_ATTRIBUTES,
  COL_RUBRIC_VARIANTS,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
} from 'db/collectionNames';
import { filterAttributesPipeline, shopProductFieldsPipeline } from 'db/dao/constantPipelines';
import {
  CatalogueBreadcrumbModel,
  ConfigModel,
  ObjectIdModel,
  ShopProductModel,
} from 'db/dbModels';
import {
  ATTRIBUTE_VIEW_VARIANT_LIST,
  CATALOGUE_FILTER_LIMIT,
  QUERY_FILTER_PAGE,
  CATALOGUE_FILTER_VISIBLE_OPTIONS,
  FILTER_SEPARATOR,
  CATALOGUE_PRODUCTS_LIMIT,
  CATALOGUE_SNIPPET_VISIBLE_ATTRIBUTES,
  DEFAULT_COMPANY_SLUG,
  DEFAULT_LOCALE,
  FILTER_PRICE_KEY,
  ROUTE_CATALOGUE,
  SHOP_PRODUCTS_DEFAULT_SORT_BY_KEY,
  SORT_ASC,
  SORT_BY_KEY,
  SORT_DESC,
  SORT_DESC_STR,
  SORT_DIR_KEY,
  DEFAULT_PAGE,
  FILTER_RUBRIC_KEY,
  FILTER_CATEGORY_KEY,
  FILTER_BRAND_KEY,
  FILTER_BRAND_COLLECTION_KEY,
  ATTRIBUTE_VIEW_VARIANT_OUTER_RATING,
  DEFAULT_SORT_STAGE,
  GENDER_HE,
  CATALOGUE_GRID_DEFAULT_COLUMNS_COUNT,
  CATEGORY_SLUG_PREFIX_SEPARATOR,
  CATEGORY_SLUG_PREFIX_WORD,
  FILTER_COMMON_KEY,
  FILTER_NO_PHOTO_KEY,
} from 'config/common';
import { getDatabase } from 'db/mongodb';
import {
  AttributeInterface,
  BrandInterface,
  CatalogueDataInterface,
  CatalogueFilterAttributeInterface,
  CatalogueFilterAttributeOptionInterface,
  CatalogueProductPricesInterface,
  CatalogueProductsAggregationInterface,
  CategoryInterface,
  OptionInterface,
  ProductAttributeInterface,
  ProductConnectionInterface,
  ShopProductInterface,
} from 'db/uiInterfaces';
import { getAlgoliaProductsSearch } from 'lib/algoliaUtils';
import { alwaysArray } from 'lib/arrayUtils';
import { getFieldStringLocale } from 'lib/i18n';
import { noNaN } from 'lib/numbers';
import { getTreeFromList } from 'lib/optionsUtils';
import { getProductCurrentViewCastedAttributes } from 'lib/productAttributesUtils';
import { castDbData, getSiteInitialData } from 'lib/ssrUtils';
import { generateSnippetTitle, generateTitle } from 'lib/titleUtils';
import { castProductConnectionForUI } from 'lib/uiDataUtils';
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

export interface GetCatalogueAttributesInterface {
  filters: string[];
  attributes: AttributeInterface[];
  locale: string;
  productsPrices: CatalogueProductPricesInterface[];
  basePath: string;
  visibleAttributesCount?: number | null;
  visibleOptionsCount?: number | null;
  rubricGender?: string;
  brands?: BrandInterface[] | null;
}

export interface GetCatalogueAttributesPayloadInterface {
  selectedFilters: AttributeInterface[];
  castedAttributes: CatalogueFilterAttributeInterface[];
  selectedAttributes: CatalogueFilterAttributeInterface[];
}

interface CastOptionInterface {
  option: OptionInterface;
  attribute: AttributeInterface;
}

interface CastOptionPayloadInterface {
  isSelected: boolean;
  optionSlug: string;
  castedOption: CatalogueFilterAttributeOptionInterface;
}

interface FilterSelectedOptionsInterface {
  option: OptionInterface;
  attributeSlug: string;
  isBrand?: boolean;
  currentBrand?: BrandInterface | null;
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
  brands,
}: GetCatalogueAttributesInterface): Promise<GetCatalogueAttributesPayloadInterface> {
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
    currentBrand,
  }: FilterSelectedOptionsInterface): OptionInterface | null {
    const optionSlug = `${attributeSlug}${FILTER_SEPARATOR}${option.slug}`;
    const isBrand = attributeSlug === FILTER_BRAND_KEY;
    const brand = isBrand
      ? (brands || []).find(({ slug }) => {
          return slug === option.slug;
        })
      : null;

    if (isBrand && !brand?.showInCatalogueTitle) {
      return null;
    }

    if (currentBrand) {
      const collection = (currentBrand.collections || []).find(({ slug }) => {
        return slug === option.slug;
      });
      if (!collection?.showInCatalogueTitle) {
        return null;
      }
    }

    const isSelected = realFilter.includes(optionSlug);
    const nestedOptions = (option.options || []).map((nestedOption) => {
      return filterSelectedOptions({
        isBrand,
        currentBrand: brand,
        option: nestedOption,
        attributeSlug: isBrand ? FILTER_BRAND_COLLECTION_KEY : attributeSlug,
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

    const isCategory = attribute.slug === FILTER_CATEGORY_KEY;
    const isBrand = attribute.slug === FILTER_BRAND_KEY;
    const nestedOptions: CatalogueFilterAttributeOptionInterface[] = [];

    if (isCategory || isBrand) {
      for await (const nestedOption of option.options || []) {
        const { castedOption } = await castOption({
          option: nestedOption,
          attribute: {
            ...attribute,
            slug: isBrand ? FILTER_BRAND_COLLECTION_KEY : attribute.slug,
          },
        });
        nestedOptions.push(castedOption);
      }
    } else {
      for await (const nestedOption of option.options || []) {
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
      if (slug === FILTER_PRICE_KEY) {
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
  isBrand: boolean;
  currentBrand?: BrandInterface | null;
  brands?: BrandInterface[] | null;
  acc: CatalogueBreadcrumbModel[];
}

export function castOptionsForBreadcrumbs({
  option,
  attribute,
  rubricSlug,
  metricValue,
  currentBrand,
  isBrand,
  brands,
  acc,
}: CastOptionsForBreadcrumbsInterface): CatalogueBreadcrumbModel[] {
  const optionSlug = `${attribute.slug}${FILTER_SEPARATOR}${option.slug}`;
  const newAcc = [...acc];
  const brand = isBrand
    ? (brands || []).find(({ slug }) => {
        return slug === option.slug;
      })
    : null;

  if (isBrand) {
    if (!brand?.showAsCatalogueBreadcrumb && !currentBrand) {
      return acc;
    }

    if (currentBrand) {
      const collections = currentBrand?.collections;
      const currentBrandCollection = (collections || []).find(({ slug }) => {
        return slug === option.slug;
      });
      if (!currentBrandCollection?.showAsCatalogueBreadcrumb) {
        return acc;
      }
    }
  }

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
      brands,
      isBrand,
      currentBrand: brand,
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
  brandFilters: string[];
  brandCollectionFilters: string[];
  inCategory: boolean;
  sortBy: string | null;
  sortDir: 1 | -1;
  sortFilterOptions: string[];
  rubricFilters?: string[] | null;
  noFiltersSelected: boolean;
  page: number;
  skip: number;
  limit: number;
  clearSlug: string;
  pricesStage: Record<any, any>;
  optionsStage: Record<any, any>;
  brandStage: Record<any, any>;
  brandCollectionStage: Record<any, any>;
  sortStage: Record<any, any>;
  defaultSortStage: Record<any, any>;
  photoStage: Record<any, any>;
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
  const brandFilters: string[] = [];
  const brandCollectionFilters: string[] = [];
  let sortBy: string | null = null;
  let sortDir: string | null = null;

  // pagination
  const defaultPage = initialPage || DEFAULT_PAGE;
  let page = defaultPage;

  const defaultLimit = initialLimit || CATALOGUE_PRODUCTS_LIMIT;
  let limit = defaultLimit;

  // sort
  const sortFilterOptions: string[] = [];

  // prices
  let minPrice: number | null = null;
  let maxPrice: number | null = null;

  // rubrics
  const rubricFilters: string[] = [];

  // photo stage
  let photoStage: Record<any, any> = {};

  filters.forEach((filterOption) => {
    const splittedOption = filterOption.split(FILTER_SEPARATOR);
    const filterAttributeSlug = splittedOption[0];
    const filterOptionSlug = splittedOption[1];
    if (filterAttributeSlug) {
      if (filterAttributeSlug === FILTER_RUBRIC_KEY) {
        rubricFilters.push(filterOptionSlug);
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

      if (filterAttributeSlug === FILTER_PRICE_KEY) {
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

      if (filterAttributeSlug === FILTER_CATEGORY_KEY) {
        realFilterOptions.push(filterOptionSlug);
        categoryFilters.push(filterOption);
        return;
      }

      if (filterAttributeSlug === FILTER_BRAND_KEY) {
        const slugParts = filterOption.split(FILTER_SEPARATOR);
        if (slugParts[1]) {
          brandFilters.push(slugParts[1]);
        }
        return;
      }

      if (filterAttributeSlug === FILTER_BRAND_COLLECTION_KEY) {
        const slugParts = filterOption.split(FILTER_SEPARATOR);
        if (slugParts[1]) {
          brandCollectionFilters.push(slugParts[1]);
        }
        return;
      }

      if (filterAttributeSlug === FILTER_COMMON_KEY) {
        if (filterOptionSlug === FILTER_NO_PHOTO_KEY) {
          photoStage = {
            mainImage: `${process.env.OBJECT_STORAGE_PRODUCT_IMAGE_FALLBACK}`,
          };
        }
        return;
      }

      realFilterOptions.push(filterOption);
    }
  });

  const noFiltersSelected = realFilterOptions.length < 1;
  const castedSortDir = sortDir === SORT_DESC_STR ? SORT_DESC : SORT_ASC;
  const skip = page ? (page - 1) * limit : 0;
  const sortPathname = sortFilterOptions.length > 0 ? `/${sortFilterOptions.join('/')}` : '';

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

  const brandStage =
    brandFilters.length > 0
      ? {
          brandSlug: {
            $in: brandFilters,
          },
        }
      : {};

  const brandCollectionStage =
    brandCollectionFilters.length > 0
      ? {
          brandCollectionSlug: {
            $in: brandCollectionFilters,
          },
        }
      : {};

  // sort stage
  const defaultSortStage = DEFAULT_SORT_STAGE;
  let sortStage: Record<any, any> = defaultSortStage;

  // sort by price
  if (sortBy === SHOP_PRODUCTS_DEFAULT_SORT_BY_KEY) {
    sortStage = {
      minPrice: castedSortDir,
      priorities: SORT_DESC,
      views: SORT_DESC,
      available: SORT_DESC,
      _id: SORT_DESC,
    };
  }

  return {
    rubricFilters: rubricFilters.length > 0 ? rubricFilters : null,
    clearSlug: sortPathname,
    minPrice,
    maxPrice,
    realFilterOptions,
    categoryFilters,
    brandFilters,
    brandCollectionFilters,
    inCategory: categoryFilters.length > 0,
    sortBy,
    sortDir: castedSortDir,
    sortFilterOptions,
    noFiltersSelected,
    page,
    limit,
    skip,
    pricesStage,
    optionsStage,
    brandStage,
    brandCollectionStage,
    sortStage,
    defaultSortStage,
    photoStage,
  };
}

export interface GetCatalogueDataInterface {
  locale: string;
  city: string;
  basePath: string;
  companySlug?: string;
  companyId?: string | ObjectIdModel | null;
  snippetVisibleAttributesCount: number;
  visibleOptionsCount: number;
  currency: string;
  input: {
    search?: string;
    rubricSlug?: string;
    filters: string[];
    page: number;
  };
}

export const getCatalogueData = async ({
  locale,
  city,
  input,
  companyId,
  snippetVisibleAttributesCount,
  visibleOptionsCount,
  currency,
  basePath,
  ...props
}: GetCatalogueDataInterface): Promise<CatalogueDataInterface | null> => {
  try {
    // console.log(' ');
    // console.log('===========================================================');
    // const timeStart = new Date().getTime();
    const { db } = await getDatabase();
    const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);

    // args
    const { rubricSlug, search } = input;
    const companySlug = props.companySlug || DEFAULT_COMPANY_SLUG;
    const searchCatalogueTitle = `Результаты поиска по запросу "${search}"`;

    // cast selected filters
    const {
      skip,
      limit,
      page,
      sortFilterOptions,
      rubricFilters,
      categoryFilters,
      inCategory,
      sortStage,
      defaultSortStage,
      brandStage,
      brandCollectionStage,
      optionsStage,
      pricesStage,
    } = castCatalogueFilters({
      filters: input.filters,
      initialPage: input.page,
      initialLimit: CATALOGUE_PRODUCTS_LIMIT,
    });

    // fallback
    const fallbackPayload: CatalogueDataInterface = {
      _id: new ObjectId(),
      clearSlug: basePath,
      filters: input.filters,
      rubricName: '',
      rubricSlug: '',
      products: [],
      catalogueTitle: 'Товары не найдены',
      catalogueFilterLayout: DEFAULT_LAYOUT,
      totalProducts: 0,
      attributes: [],
      selectedAttributes: [],
      breadcrumbs: [],
      gridSnippetLayout: GRID_SNIPPET_LAYOUT_BIG_IMAGE,
      rowSnippetLayout: ROW_SNIPPET_LAYOUT_BIG_IMAGE,
      showSnippetConnections: true,
      showSnippetBackground: true,
      showSnippetArticle: false,
      showSnippetButtonsOnHover: false,
      gridCatalogueColumns: CATALOGUE_GRID_DEFAULT_COLUMNS_COUNT,
      brandSlugs: [],
      brandCollectionSlugs: [],
      categorySlugs: [],
      basePath,
      page,
    };

    // rubric stage
    let rubricStage: Record<any, any> = rubricSlug
      ? {
          rubricSlug,
        }
      : {};
    if (rubricFilters && rubricFilters.length > 0) {
      rubricStage = {
        rubricSlug: {
          $in: rubricFilters,
        },
      };
    }

    // search stage
    let searchStage = {};
    let searchIds: ObjectIdModel[] = [];
    if (search) {
      searchIds = await getAlgoliaProductsSearch({
        indexName: `${process.env.ALG_INDEX_PRODUCTS}`,
        search,
      });
      searchStage = {
        productId: {
          $in: searchIds,
        },
      };
    }
    if (search && searchIds.length < 1) {
      return fallbackPayload;
    }

    // initial match
    const companyMatch = companyId ? { companyId: new ObjectId(companyId) } : {};
    const productsInitialMatch = {
      ...rubricStage,
      citySlug: city,
    };
    const productsMatch = {
      ...searchStage,
      ...companyMatch,
      ...rubricStage,
      citySlug: city,
      ...brandStage,
      ...brandCollectionStage,
      ...optionsStage,
      ...pricesStage,
    };

    // aggregate catalogue initial data
    const productDataAggregationResult = await shopProductsCollection
      .aggregate<CatalogueProductsAggregationInterface>([
        // match shop products
        {
          $match: productsInitialMatch,
        },

        // unwind selectedOptionsSlugs field
        {
          $unwind: {
            path: '$selectedOptionsSlugs',
            preserveNullAndEmptyArrays: true,
          },
        },

        // group shop products by productId field
        {
          $group: {
            _id: '$productId',
            companyId: { $first: `$companyId` },
            itemId: { $first: '$itemId' },
            rubricId: { $first: '$rubricId' },
            rubricSlug: { $first: `$rubricSlug` },
            citySlug: { $first: `$citySlug` },
            brandSlug: { $first: '$brandSlug' },
            brandCollectionSlug: { $first: '$brandCollectionSlug' },
            views: { $max: `$views.${companySlug}.${city}` },
            priorities: { $max: `$priorities.${companySlug}.${city}` },
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

        // catalogue data facets
        {
          $facet: {
            // docs facet
            docs: [
              {
                $match: productsMatch,
              },
              {
                $sort: sortStage,
              },
              {
                $skip: skip,
              },
              {
                $limit: limit,
              },

              // add ui prices
              {
                $addFields: {
                  shopsCount: { $size: '$shopsIds' },
                  cardPrices: {
                    min: '$minPrice',
                    max: '$maxPrice',
                  },
                },
              },

              // get shop product fields
              ...shopProductFieldsPipeline('$_id'),

              // get product attributes
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
                        viewVariant: ATTRIBUTE_VIEW_VARIANT_LIST,
                      },
                    },
                  ],
                },
              },
            ],

            // prices facet
            prices: [
              {
                $group: {
                  _id: '$minPrice',
                },
              },
            ],

            // categories facet
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
              {
                $lookup: {
                  from: COL_CATEGORIES,
                  as: 'categories',
                  let: {
                    rubricId: '$rubricId',
                    selectedOptionsSlugs: '$selectedOptionsSlugs',
                  },
                  pipeline: [
                    {
                      $match: {
                        $and: [
                          {
                            $expr: {
                              $eq: ['$rubricId', '$$rubricId'],
                            },
                          },
                          {
                            $expr: {
                              $in: ['$slug', '$$selectedOptionsSlugs'],
                            },
                          },
                        ],
                      },
                    },
                    {
                      $addFields: {
                        views: { $max: `$views.${companySlug}.${city}` },
                        priorities: { $max: `$priorities.${companySlug}.${city}` },
                      },
                    },
                    {
                      $sort: defaultSortStage,
                    },
                  ],
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

            // category slugs facet
            selectedOptionsSlugs: [
              {
                $unwind: {
                  path: '$selectedOptionsSlugs',
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $group: {
                  _id: '$selectedOptionsSlugs',
                },
              },
            ],

            // brand slugs facet
            brandSlugs: [
              {
                $group: {
                  _id: '$brandSlug',
                },
              },
            ],

            // brandCollection slugs facet
            brandCollectionSlugs: [
              {
                $group: {
                  _id: '$brandCollectionSlug',
                },
              },
            ],

            // brands facet
            brands: [
              {
                $group: {
                  _id: '$brandSlug',
                  collectionSlugs: {
                    $addToSet: '$brandCollectionSlug',
                  },
                },
              },
              {
                $lookup: {
                  from: COL_BRANDS,
                  as: 'brand',
                  let: {
                    slug: '$_id',
                    collectionSlugs: '$collectionSlugs',
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ['$slug', '$$slug'],
                        },
                      },
                    },
                    {
                      $lookup: {
                        from: COL_BRAND_COLLECTIONS,
                        as: 'collections',
                        let: {
                          brandId: '$_id',
                        },
                        pipeline: [
                          {
                            $match: {
                              $and: [
                                {
                                  $expr: {
                                    $eq: ['$brandId', '$$brandId'],
                                  },
                                },
                                {
                                  $expr: {
                                    $in: ['$slug', '$$collectionSlugs'],
                                  },
                                },
                              ],
                            },
                          },
                          {
                            $addFields: {
                              views: { $max: `$views.${companySlug}.${city}` },
                              priorities: { $max: `$priorities.${companySlug}.${city}` },
                            },
                          },
                          {
                            $sort: defaultSortStage,
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                $addFields: {
                  brand: {
                    $arrayElemAt: ['$brand', 0],
                  },
                },
              },
              {
                $match: {
                  brand: {
                    $exists: true,
                  },
                },
              },
              {
                $replaceRoot: {
                  newRoot: '$brand',
                },
              },
              {
                $addFields: {
                  views: { $max: `$views.${companySlug}.${city}` },
                  priorities: { $max: `$priorities.${companySlug}.${city}` },
                },
              },
              {
                $sort: defaultSortStage,
              },
            ],

            // rubric facet
            rubrics: [
              {
                $group: {
                  _id: '$rubricId',
                },
              },
              {
                $lookup: {
                  from: COL_RUBRICS,
                  as: 'rubric',
                  let: {
                    rubricId: '$_id',
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ['$_id', '$$rubricId'],
                        },
                      },
                    },
                    {
                      $project: {
                        views: false,
                        priorities: false,
                      },
                    },

                    // get rubric variant
                    {
                      $lookup: {
                        from: COL_RUBRIC_VARIANTS,
                        as: 'variant',
                        let: {
                          variantId: '$variantId',
                        },
                        pipeline: [
                          {
                            $match: {
                              $expr: {
                                $eq: ['$$variantId', '$_id'],
                              },
                            },
                          },
                        ],
                      },
                    },
                    {
                      $addFields: {
                        variant: {
                          $arrayElemAt: ['$variant', 0],
                        },
                      },
                    },
                  ],
                },
              },
              {
                $replaceRoot: {
                  newRoot: {
                    $arrayElemAt: ['$rubric', 0],
                  },
                },
              },
            ],

            // attributes facet
            attributes: filterAttributesPipeline(defaultSortStage),
          },
        },

        // TODO >>>>>>>>>>>>>>>>>>>>>>>>>
        // countAllDocs facet
        {
          $addFields: {
            totalProducts: {
              $size: '$docs',
            },
          },
        },
      ])
      .toArray();
    const productDataAggregation = productDataAggregationResult[0];
    if (!productDataAggregation) {
      return fallbackPayload;
    }

    const {
      docs,
      totalProducts,
      attributes,
      rubrics,
      brands,
      categories,
      prices,
      brandSlugs,
      selectedOptionsSlugs,
      brandCollectionSlugs,
    } = productDataAggregation;

    if (rubrics.length < 1) {
      return fallbackPayload;
    }

    const rubric = rubrics[0];
    if (!rubric) {
      return fallbackPayload;
    }

    // get filter attributes
    // price attribute
    const priceAttribute = getPriceAttribute();

    // category attribute
    let categoryAttribute: AttributeInterface[] = [];
    const showCategoriesInFilter = search ? true : Boolean(rubric.variant?.showCategoriesInFilter);
    if (categories && categories.length > 0 && showCategoriesInFilter) {
      categoryAttribute = [
        getCategoryFilterAttribute({
          locale,
          categories,
        }),
      ];
    }

    // brand attribute
    let brandAttribute: AttributeInterface[] = [];
    const showBrandInFilter = search ? true : Boolean(rubric?.showBrandInFilter);
    if (brands && brands.length > 0 && showBrandInFilter) {
      brandAttribute = [
        getBrandFilterAttribute({
          locale,
          brands: brands,
        }),
      ];
    }

    // rubric attributes
    const initialAttributes = (attributes || []).reduce((acc: AttributeInterface[], attribute) => {
      if (!attribute.showInCatalogueFilter) {
        return acc;
      }
      return [
        ...acc,
        {
          ...attribute,
          options: getTreeFromList({
            list: attribute.options,
            childrenFieldName: 'options',
          }),
        },
      ];
    }, []);
    const rubricAttributes = inCategory
      ? initialAttributes
      : initialAttributes.filter(({ _id }) => {
          return (rubric?.filterVisibleAttributeIds || []).some((attributeId) => {
            return attributeId.equals(_id);
          });
        });

    // rubrics as attribute
    const rubricsAsFilters = search
      ? [
          getRubricFilterAttribute({
            rubrics,
            locale,
          }),
        ]
      : [];

    // cast catalogue attributes
    const { selectedFilters, castedAttributes, selectedAttributes } = await getCatalogueAttributes({
      attributes: [
        ...rubricsAsFilters,
        ...categoryAttribute,
        priceAttribute,
        ...brandAttribute,
        ...rubricAttributes,
      ],
      locale,
      filters: input.filters,
      productsPrices: prices,
      basePath,
      visibleOptionsCount,
      rubricGender: search ? GENDER_HE : rubric.catalogueTitle.gender,
      brands,
      // visibleAttributesCount,
    });

    // cast catalogue products
    const products: ShopProductInterface[] = [];
    docs.forEach((shopProduct) => {
      const product = shopProduct.product;
      if (!product) {
        return;
      }

      // product prices
      const minPrice = noNaN(shopProduct.cardPrices?.min);
      const maxPrice = noNaN(shopProduct.cardPrices?.max);
      const cardPrices = {
        _id: new ObjectId(),
        min: `${minPrice}`,
        max: `${maxPrice}`,
      };

      // product attributes
      const optionSlugs = shopProduct.selectedOptionsSlugs.reduce((acc: string[], selectedSlug) => {
        const slugParts = selectedSlug.split(FILTER_SEPARATOR);
        const optionSlug = slugParts[1];
        if (!optionSlug) {
          return acc;
        }
        return [...acc, optionSlug];
      }, []);

      const productAttributes = (product.attributes || []).reduce(
        (acc: ProductAttributeInterface[], attribute) => {
          const existingAttribute = (attributes || []).find(({ _id }) => {
            return _id.equals(attribute.attributeId);
          });
          if (!existingAttribute) {
            return acc;
          }

          const options = (existingAttribute.options || []).filter(({ slug }) => {
            return optionSlugs.includes(slug);
          });

          const productAttribute: ProductAttributeInterface = {
            ...attribute,
            name: getFieldStringLocale(attribute.nameI18n, locale),
            metric: attribute.metric
              ? {
                  ...attribute.metric,
                  name: getFieldStringLocale(attribute.metric.nameI18n, locale),
                }
              : null,
            options: getTreeFromList({
              list: options,
              childrenFieldName: 'options',
              locale,
            }),
          };
          return [...acc, productAttribute];
        },
        [],
      );

      // product categories
      const initialProductCategories = (categories || []).filter(({ slug }) => {
        return shopProduct.selectedOptionsSlugs.includes(slug);
      });
      const productCategories = getTreeFromList({
        list: initialProductCategories,
        childrenFieldName: 'categories',
        locale,
      });

      // product brand
      const productBrand = product.brandSlug
        ? (brands || []).find(({ slug }) => {
            return slug === product.brandSlug;
          })
        : null;

      // snippet title
      const snippetTitle = generateSnippetTitle({
        locale,
        brand: productBrand
          ? {
              ...productBrand,
              collections: (productBrand.collections || []).filter((collection) => {
                return collection.slug === product.brandCollectionSlug;
              }),
            }
          : null,
        rubricName: getFieldStringLocale(rubric.nameI18n, locale),
        showRubricNameInProductTitle: rubric.showRubricNameInProductTitle,
        showCategoryInProductTitle: rubric.showCategoryInProductTitle,
        attributes: productAttributes,
        categories: productCategories,
        titleCategoriesSlugs: product.titleCategoriesSlugs,
        originalName: product.originalName,
        defaultGender: product.gender,
      });

      // list features
      const initialListFeatures = getProductCurrentViewCastedAttributes({
        attributes: productAttributes,
        viewVariant: ATTRIBUTE_VIEW_VARIANT_LIST,
        locale,
      });
      const listFeatures = initialListFeatures
        .filter(({ showInSnippet }) => {
          return showInSnippet;
        })
        .slice(0, snippetVisibleAttributesCount);

      // rating features
      const initialRatingFeatures = getProductCurrentViewCastedAttributes({
        attributes: productAttributes,
        viewVariant: ATTRIBUTE_VIEW_VARIANT_OUTER_RATING,
        locale,
      });
      const ratingFeatures = initialRatingFeatures.filter(({ showInSnippet }) => {
        return showInSnippet;
      });

      // connections
      const connections = (product.connections || []).reduce(
        (acc: ProductConnectionInterface[], connection) => {
          const castedConnection = castProductConnectionForUI({
            connection,
            locale,
          });

          if (!castedConnection) {
            return acc;
          }

          return [...acc, castedConnection];
        },
        [],
      );

      products.push({
        ...shopProduct,
        product: {
          ...product,
          shopsCount: shopProduct.shopsCount,
          listFeatures,
          ratingFeatures,
          name: getFieldStringLocale(product.nameI18n, locale),
          cardPrices,
          connections,
          snippetTitle,
        },
      });
    });

    // get catalogue title
    const catalogueTitle = search
      ? searchCatalogueTitle
      : generateTitle({
          positionFieldName: 'positioningInTitle',
          attributeNameVisibilityFieldName: 'showNameInTitle',
          attributeVisibilityFieldName: 'showInCatalogueTitle',
          defaultGender: rubric.catalogueTitle.gender,
          fallbackTitle: getFieldStringLocale(rubric.catalogueTitle.defaultTitleI18n, locale),
          defaultKeyword: getFieldStringLocale(rubric.catalogueTitle.keywordI18n, locale),
          prefix: getFieldStringLocale(rubric.catalogueTitle.prefixI18n, locale),
          attributes: selectedFilters,
          capitaliseKeyWord: rubric.capitalise,
          categories,
          locale,
          currency,
        });

    const sortPathname = sortFilterOptions.length > 0 ? `/${sortFilterOptions.join('/')}` : '';

    // get catalogue breadcrumbs
    const rubricName = search ? 'Результат поиска' : getFieldStringLocale(rubric.nameI18n, locale);
    const breadcrumbs: CatalogueBreadcrumbModel[] = [
      {
        _id: rubric._id,
        name: rubricName,
        href: basePath,
      },
    ];

    selectedAttributes.forEach((selectedAttribute) => {
      const { options, showAsCatalogueBreadcrumb, slug } = selectedAttribute;
      const isPrice = slug === FILTER_PRICE_KEY;
      const isBrand = slug === FILTER_BRAND_KEY;
      let metricValue = selectedAttribute.metric ? ` ${selectedAttribute.metric}` : '';
      if (isPrice) {
        metricValue = currency;
      }

      if ((showAsCatalogueBreadcrumb || isPrice || isBrand) && rubricSlug) {
        const optionBreadcrumbs = options.reduce((acc: CatalogueBreadcrumbModel[], option) => {
          const tree = castOptionsForBreadcrumbs({
            option: option,
            isBrand,
            brands,
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
    let clearSlug = basePath;
    if (showCategoriesInFilter) {
      const clearPath = [...categoryFilters, sortPathname]
        .filter((pathPart) => {
          return pathPart;
        })
        .join('/');
      clearSlug = `${basePath}/${clearPath}`;
    }
    if (search) {
      clearSlug = basePath;
    }

    // get seo text
    const selectedCategories: CategoryInterface[] = [];
    selectedAttributes.forEach((attribute) => {
      const { options, slug } = attribute;
      if (slug === FILTER_CATEGORY_KEY) {
        options.forEach((option) => {
          const currentCategory = (categories || []).find(({ slug }) => {
            return slug === option.slug;
          });
          if (currentCategory) {
            selectedCategories.push(currentCategory);
          }
        });
      }
    });
    let textTop: string | null | undefined = getFieldStringLocale(rubric.textTopI18n, locale);
    let textBottom: string | null | undefined = getFieldStringLocale(rubric.textBottomI18n, locale);
    if (selectedCategories.length > 0 && selectedCategories.length < 2 && selectedCategories[0]) {
      textTop = getFieldStringLocale(selectedCategories[0].textTopI18n, locale);
      textBottom = getFieldStringLocale(selectedCategories[0].textBottomI18n, locale);
    }
    if (selectedCategories.length > 1) {
      textTop = null;
      textBottom = null;
    }

    // get layout configs
    const catalogueFilterLayout = search
      ? DEFAULT_LAYOUT
      : rubric.variant?.catalogueFilterLayout || DEFAULT_LAYOUT;

    const gridSnippetLayout = search
      ? GRID_SNIPPET_LAYOUT_BIG_IMAGE
      : rubric.variant?.gridSnippetLayout || DEFAULT_LAYOUT;

    const rowSnippetLayout = search
      ? ROW_SNIPPET_LAYOUT_BIG_IMAGE
      : rubric.variant?.rowSnippetLayout || DEFAULT_LAYOUT;

    const showSnippetConnections = search ? true : rubric.variant?.showSnippetConnections || true;

    const showSnippetBackground = search ? true : rubric.variant?.showSnippetBackground || true;

    const showSnippetArticle = search ? false : rubric.variant?.showSnippetArticle || false;

    const showSnippetButtonsOnHover = search
      ? false
      : rubric.variant?.showSnippetButtonsOnHover || false;

    const gridCatalogueColumns = search
      ? CATALOGUE_GRID_DEFAULT_COLUMNS_COUNT
      : rubric.variant?.gridCatalogueColumns || CATALOGUE_GRID_DEFAULT_COLUMNS_COUNT;

    // console.log(`Catalogue data >>>>>>>>>>>>>>>> `, new Date().getTime() - timeStart);
    return {
      _id: rubric._id,
      clearSlug,
      categorySlugs: selectedOptionsSlugs
        .filter((slug) => slug._id)
        .reduce((acc: string[], slug) => {
          const slugParts = slug._id.split(CATEGORY_SLUG_PREFIX_SEPARATOR);
          if (slugParts[0] === CATEGORY_SLUG_PREFIX_WORD && slugParts[1]) {
            return [...acc, slug._id];
          }
          return acc;
        }, []),
      brandSlugs: brandSlugs.filter((slug) => slug._id).map((slug) => slug._id),
      brandCollectionSlugs: brandCollectionSlugs.filter((slug) => slug._id).map((slug) => slug._id),
      filters: input.filters,
      rubricName,
      rubricSlug: rubric.slug,
      textTop,
      textBottom,
      products,
      catalogueTitle,
      catalogueFilterLayout,
      gridSnippetLayout,
      rowSnippetLayout,
      showSnippetConnections,
      showSnippetBackground,
      showSnippetArticle,
      showSnippetButtonsOnHover,
      gridCatalogueColumns,
      totalProducts: noNaN(totalProducts),
      attributes: castedAttributes,
      selectedAttributes: showCategoriesInFilter
        ? selectedAttributes
        : selectedAttributes.filter(({ slug }) => {
            return slug !== FILTER_CATEGORY_KEY;
          }),
      page,
      breadcrumbs,
      basePath,
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
  const { rubricSlug } = query;

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
    currency: props.initialData.currency,
    basePath: `${ROUTE_CATALOGUE}/${rubricSlug}`,
    snippetVisibleAttributesCount: props.initialData.configs.snippetAttributesCount,
    visibleOptionsCount: props.initialData.configs.catalogueFilterVisibleOptionsCount,
    input: {
      rubricSlug: `${rubricSlug}`,
      filters: alwaysArray(query.filters),
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
      catalogueData: castDbData(rawCatalogueData),
    },
  };
}
