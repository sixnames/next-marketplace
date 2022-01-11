import {
  DEFAULT_SORT_STAGE,
  SHOP_PRODUCTS_DEFAULT_SORT_BY_KEY,
  SORT_ASC,
  SORT_DESC,
  SORT_DESC_STR,
} from '../config/common';
import { ObjectIdModel } from '../db/dbModels';
import { getAlgoliaProductsSearch } from './algolia/productAlgoliaUtils';
import { alwaysString } from './arrayUtils';
import {
  getFilterUrlValues,
  GetFilterUrlValuesInterface,
  GetFilterUrlValuesPayloadInterface,
} from './getFilterUrlValues';

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
