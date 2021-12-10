import { PAGINATION_DEFAULT_LIMIT } from 'config/common';
import { COL_RUBRICS, COL_SHOP_PRODUCTS } from 'db/collectionNames';
import { ObjectIdModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  GetConsoleRubricPromoProductsPayloadInterface,
  RubricInterface,
  ShopProductInterface,
} from 'db/uiInterfaces';
import { alwaysArray } from 'lib/arrayUtils';
import { castUrlFilters } from 'lib/catalogueUtils';
import { ObjectId } from 'mongodb';
import { ParsedUrlQuery } from 'querystring';

interface GetConsolePromoProductsInterface {
  companyId: ObjectIdModel;
  promoId: ObjectIdModel;
  basePath: string;
  locale: string;
  currency: string;
  query: ParsedUrlQuery;
}

export async function getConsolePromoProducts({
  basePath,
  query,
  companyId,
  currency,
  locale,
  promoId,
}: GetConsolePromoProductsInterface): Promise<GetConsoleRubricPromoProductsPayloadInterface> {
  let fallbackPayload: GetConsoleRubricPromoProductsPayloadInterface = {
    clearSlug: basePath,
    basePath,
    page: 1,
    totalDocs: 0,
    totalPages: 0,
    docs: [],
    attributes: [],
    selectedAttributes: [],
  };

  try {
    const { db } = await getDatabase();
    const rubricsCollection = db.collection<RubricInterface>(COL_RUBRICS);
    const shopProductsCollection = db.collection<ShopProductInterface>(COL_SHOP_PRODUCTS);
    const [rubricId, ...filters] = alwaysArray(query.filters);

    // get rubric
    const rubric = await rubricsCollection.findOne({
      _id: new ObjectId(rubricId),
    });
    if (!rubric) {
      return fallbackPayload;
    }

    // update fallback payload
    fallbackPayload = {
      ...fallbackPayload,
      rubric,
    };

    // cast selected filters
    const {
      skip,
      page,
      limit,
      rubricFilters,
      brandStage,
      brandCollectionStage,
      optionsStage,
      pricesStage,
      photoStage,
      searchStage,
      noSearchResults,
    } = await castUrlFilters({
      filters,
      initialLimit: PAGINATION_DEFAULT_LIMIT,
      search: query.search,
      searchFieldName: 'productId',
    });

    // rubric stage
    let rubricStage: Record<any, any> = {
      rubricId: new ObjectId(rubricId),
    };
    if (rubricFilters && rubricFilters.length > 0) {
      rubricStage = {
        rubricSlug: {
          $in: rubricFilters,
        },
      };
    }

    // search stage
    if (noSearchResults) {
      return fallbackPayload;
    }

    // initial match
    const productsInitialMatch = {
      ...searchStage,
      ...rubricStage,
      ...brandStage,
      ...brandCollectionStage,
      ...optionsStage,
      ...pricesStage,
      ...photoStage,
    };

    // TODO
    console.log({
      productsInitialMatch,
      skip,
      page,
      limit,
      shopProductsCollection,
      companyId,
      currency,
      locale,
      promoId,
    });

    // TODO
    return fallbackPayload;
  } catch (e) {
    console.log('getConsolePromoProducts error ', e);
    return fallbackPayload;
  }
}
