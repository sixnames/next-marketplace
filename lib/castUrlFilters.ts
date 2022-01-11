import {
  CATALOGUE_FILTER_LIMIT,
  CATALOGUE_PRODUCTS_LIMIT,
  DEFAULT_PAGE,
  DEFAULT_SORT_STAGE,
  FILTER_BRAND_COLLECTION_KEY,
  FILTER_BRAND_KEY,
  FILTER_CATEGORY_KEY,
  FILTER_COMMON_KEY,
  FILTER_NO_PHOTO_KEY,
  FILTER_PAGE_KEY,
  FILTER_PRICE_KEY,
  FILTER_RUBRIC_KEY,
  FILTER_SEPARATOR,
  SHOP_PRODUCTS_DEFAULT_SORT_BY_KEY,
  SORT_ASC,
  SORT_BY_KEY,
  SORT_DESC,
  SORT_DESC_STR,
  SORT_DIR_KEY,
} from '../config/common';
import { noImageStage } from '../db/dao/constantPipelines';
import { ObjectIdModel } from '../db/dbModels';
import { getAlgoliaProductsSearch } from './algolia/productAlgoliaUtils';
import { alwaysString } from './arrayUtils';
import { noNaN } from './numbers';

interface GetFilterUrlValuesInterface {
  filters: string[];
  initialLimit?: number;
  initialPage?: number;
}

interface GetFilterUrlValuesPayloadInterface {
  allUrlParams: string[];
  categoryCastedFilters: string[];
  priceFilters: string[];
  realFilters: string[];
  realFilterAttributes: string[];
  categoryFilters: string[];
  brandFilters: string[];
  brandCollectionFilters: string[];
  sortBy: string | null;
  sortDirString: string | null;
  page: number;
  limit: number;
  minPrice?: number | null;
  maxPrice?: number | null;
  noCategoryFilters: string[];
  sortFilterOptions: string[];
  rubricFilters?: string[] | null;
  photoStage: Record<any, any>;
}

export function getFilterUrlValues({
  initialPage,
  initialLimit,
  filters,
}: GetFilterUrlValuesInterface): GetFilterUrlValuesPayloadInterface {
  const allUrlParams: string[] = [];
  const categoryCastedFilters: string[] = [];
  const priceFilters: string[] = [];
  const realFilters: string[] = [];
  const realFilterAttributes: string[] = [];
  const categoryFilters: string[] = [];
  const brandFilters: string[] = [];
  const brandCollectionFilters: string[] = [];
  const noCategoryFilters: string[] = [];
  let sortBy: string | null = null;
  let sortDirString: string | null = null;

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
    if (!filterOptionSlug) {
      return;
    }

    if (filterAttributeSlug) {
      allUrlParams.push(filterOption);

      if (filterAttributeSlug === FILTER_RUBRIC_KEY) {
        rubricFilters.push(filterOptionSlug);
        return;
      }

      if (filterAttributeSlug === FILTER_PAGE_KEY) {
        page = noNaN(filterOptionSlug) || defaultPage;
        return;
      }

      if (filterAttributeSlug === CATALOGUE_FILTER_LIMIT) {
        limit = noNaN(filterOptionSlug) || defaultLimit;
        return;
      }

      if (filterAttributeSlug === FILTER_PRICE_KEY) {
        priceFilters.push(filterOption);
        noCategoryFilters.push(filterOption);
        const prices = filterOptionSlug.split('_');
        minPrice = noNaN(prices[0]);
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
        sortDirString = filterOptionSlug;
        return;
      }

      if (filterAttributeSlug === FILTER_CATEGORY_KEY) {
        allUrlParams.push(filterOption);
        realFilters.push(filterOptionSlug);
        categoryFilters.push(filterOption);
        categoryCastedFilters.push(filterOptionSlug);
        return;
      }

      if (filterAttributeSlug === FILTER_BRAND_KEY) {
        noCategoryFilters.push(filterOption);
        const slugParts = filterOption.split(FILTER_SEPARATOR);
        if (slugParts[1]) {
          brandFilters.push(slugParts[1]);
        }
        return;
      }

      if (filterAttributeSlug === FILTER_BRAND_COLLECTION_KEY) {
        noCategoryFilters.push(filterOption);
        const slugParts = filterOption.split(FILTER_SEPARATOR);
        if (slugParts[1]) {
          brandCollectionFilters.push(slugParts[1]);
        }
        return;
      }

      if (filterAttributeSlug === FILTER_COMMON_KEY) {
        if (filterOptionSlug === FILTER_NO_PHOTO_KEY) {
          photoStage = noImageStage;
        }
        return;
      }

      noCategoryFilters.push(filterOption);
      realFilterAttributes.push(filterAttributeSlug);
      realFilters.push(filterOption);
    }
  });

  return {
    allUrlParams,
    categoryCastedFilters,
    priceFilters,
    realFilters,
    realFilterAttributes,
    categoryFilters,
    brandFilters,
    brandCollectionFilters,
    sortBy,
    sortDirString,
    page,
    limit,
    minPrice,
    maxPrice,
    noCategoryFilters,
    sortFilterOptions,
    rubricFilters,
    photoStage,
  };
}

interface CastUrlFiltersPayloadInterface extends GetFilterUrlValuesPayloadInterface {
  sortDir: 1 | -1;
  inCategory: boolean;
  noFiltersSelected: boolean;
  skip: number;
  clearSlug: string;
  pricesStage: Record<any, any>;
  optionsStage: Record<any, any>;
  brandStage: Record<any, any>;
  brandCollectionStage: Record<any, any>;
  sortStage: Record<any, any>;
  defaultSortStage: Record<any, any>;
  searchStage: Record<any, any>;
  searchIds: ObjectIdModel[];
  noSearchResults: boolean;
}

interface CastUrlFiltersInterface extends GetFilterUrlValuesInterface {
  search?: string | string[] | null;
  excludedSearchIds?: ObjectIdModel[] | null;
  searchFieldName: string;
}

export async function castUrlFilters({
  filters,
  initialPage,
  initialLimit,
  excludedSearchIds,
  searchFieldName,
  ...props
}: CastUrlFiltersInterface): Promise<CastUrlFiltersPayloadInterface> {
  const {
    allUrlParams,
    brandCollectionFilters,
    brandFilters,
    categoryCastedFilters,
    categoryFilters,
    limit,
    maxPrice,
    minPrice,
    noCategoryFilters,
    page,
    photoStage,
    priceFilters,
    realFilterAttributes,
    realFilters,
    rubricFilters,
    sortBy,
    sortDirString,
    sortFilterOptions,
  } = getFilterUrlValues({
    filters,
    initialLimit,
    initialPage,
  });
  const noFiltersSelected = noCategoryFilters.length < 1;
  const castedSortDir = sortDirString === SORT_DESC_STR ? SORT_DESC : SORT_ASC;
  const skip = page ? (page - 1) * limit : 0;
  const sortPathname = sortFilterOptions.length > 0 ? `/${sortFilterOptions.join('/')}` : '';

  const pricesStage = maxPrice
    ? {
        price: {
          $gte: minPrice,
          $lte: maxPrice,
        },
      }
    : {};

  const optionsStage =
    realFilters.length > 0
      ? {
          filterSlugs: {
            $all: realFilters,
          },
        }
      : {};

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
  let sortStage: Record<any, any> = {
    views: SORT_DESC,
    _id: SORT_DESC,
  };

  // sort by price
  if (sortBy === SHOP_PRODUCTS_DEFAULT_SORT_BY_KEY) {
    sortStage = {
      minPrice: castedSortDir,
      views: SORT_DESC,
      _id: SORT_DESC,
    };
  }

  // search stage
  let searchStage = {};
  let searchIds: ObjectIdModel[] = [];
  const search = alwaysString(props.search);

  if (search) {
    searchIds = await getAlgoliaProductsSearch({
      search,
      excludedProductsIds: excludedSearchIds,
    });
    searchStage = {
      [searchFieldName]: {
        $in: searchIds,
      },
    };
  }

  return {
    noCategoryFilters,
    searchStage,
    searchIds,
    noSearchResults: search.length > 0 && searchIds.length < 1,
    allUrlParams,
    rubricFilters: (rubricFilters || []).length > 0 ? rubricFilters : null,
    clearSlug: sortPathname,
    minPrice,
    maxPrice,
    realFilters,
    realFilterAttributes,
    categoryFilters,
    categoryCastedFilters,
    priceFilters,
    brandFilters,
    brandCollectionFilters,
    inCategory: categoryFilters.length > 0,
    sortBy,
    sortDir: castedSortDir,
    sortFilterOptions,
    noFiltersSelected,
    sortDirString,
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
