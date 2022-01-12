import {
  CATALOGUE_FILTER_LIMIT,
  CATALOGUE_PRODUCTS_LIMIT,
  DEFAULT_PAGE,
  FILTER_BRAND_COLLECTION_KEY,
  FILTER_BRAND_KEY,
  FILTER_CATEGORY_KEY,
  FILTER_COMMON_KEY,
  FILTER_NO_PHOTO_KEY,
  FILTER_PAGE_KEY,
  FILTER_PRICE_KEY,
  FILTER_RUBRIC_KEY,
  FILTER_SEPARATOR,
  SORT_BY_KEY,
  SORT_DIR_KEY,
} from '../config/common';
import { noImageStage } from '../db/dao/constantPipelines';
import { noNaN } from './numbers';

export interface GetFilterUrlValuesInterface {
  filters: string[];
  initialLimit?: number;
  initialPage?: number;
}

export interface GetFilterUrlValuesPayloadInterface {
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
