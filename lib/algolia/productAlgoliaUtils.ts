import addZero from 'add-zero';
import { ObjectIdModel, TranslationModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { ProductSummaryInterface } from 'db/uiInterfaces';
import { HITS_PER_PAGE, ID_COUNTER_DIGITS } from 'lib/config/common';
import { ObjectId } from 'mongodb';
import { noNaN } from '../numbers';
import { deleteAlgoliaObjects, getAlgoliaClient, saveAlgoliaObjects } from './algoliaUtils';

require('dotenv').config();

export function getAlgoliaProductsIndex() {
  const { algoliaIndex } = getAlgoliaClient(`${process.env.ALG_INDEX_PRODUCTS}`);
  return algoliaIndex;
}

interface AlgoliaProductInterface {
  _id: string;
  objectID: string;
  cardTitleI18n: TranslationModel;
  snippetTitleI18n: TranslationModel;
  barcode?: string[] | null;
  slug: string;
}

export async function updateAlgoliaProducts(match?: Record<any, any>) {
  try {
    const collections = await getDbCollections();
    const productSummariesCollection = collections.productSummariesCollection();

    const aggregationMatch = match
      ? [
          {
            $match: match,
          },
        ]
      : [];

    const products = await productSummariesCollection
      .aggregate<ProductSummaryInterface>([...aggregationMatch])
      .toArray();

    const algoliaProducts: AlgoliaProductInterface[] = [];
    for await (const initialProduct of products) {
      let algoliaProduct: AlgoliaProductInterface = {
        _id: initialProduct._id.toHexString(),
        slug: initialProduct.slug,
        objectID: initialProduct._id.toHexString(),
        barcode: initialProduct.barcode,
        cardTitleI18n: initialProduct.cardTitleI18n,
        snippetTitleI18n: initialProduct.snippetTitleI18n,
      };
      algoliaProducts.push(algoliaProduct);
    }

    if (algoliaProducts.length > 0) {
      const algoliaProductResult = await saveAlgoliaObjects({
        indexName: `${process.env.ALG_INDEX_PRODUCTS}`,
        objects: algoliaProducts,
      });

      if (!algoliaProductResult) {
        console.log('updateAlgoliaProducts algolia error');
        return false;
      }
    }

    return true;
  } catch (e) {
    console.log('updateAlgoliaProducts error ', e);
    return false;
  }
}

interface DeleteProductAlgoliaObjectsInterface {
  productIds: ObjectIdModel[];
}

export const deleteProductAlgoliaObjects = async ({
  productIds,
}: DeleteProductAlgoliaObjectsInterface) => {
  try {
    const algoliaProductResult = await deleteAlgoliaObjects({
      indexName: `${process.env.ALG_INDEX_PRODUCTS}`,
      objectIDs: productIds.map((_id) => _id.toHexString()),
    });
    return algoliaProductResult;
  } catch (e) {
    console.log(e);
    return false;
  }
};

interface GetAlgoliaProductsSearch {
  search: string;
  excludedProductsIds?: ObjectIdModel[] | null;
}

export async function getAlgoliaProductsSearch({
  search,
  excludedProductsIds,
}: GetAlgoliaProductsSearch): Promise<ObjectId[]> {
  const collections = await getDbCollections();
  const productFacetsCollection = collections.productFacetsCollection();
  const algoliaIndex = getAlgoliaProductsIndex();
  const searchIds: ObjectId[] = [];
  try {
    if (!search) {
      return searchIds;
    }
    if (noNaN(search) > 0) {
      const productBySlug = await productFacetsCollection.findOne({
        slug: addZero(search, ID_COUNTER_DIGITS),
      });
      if (productBySlug) {
        return [productBySlug._id];
      }
    }

    const { hits } = await algoliaIndex.search<AlgoliaProductInterface>(search, {
      hitsPerPage: HITS_PER_PAGE,
      // optionalWords: `${search}`.split(' ').slice(1),
    });

    hits.forEach((hit) => {
      const hitId = new ObjectId(hit._id);
      const exist = (excludedProductsIds || []).some((_id) => {
        return _id.equals(hitId);
      });

      if (!exist) {
        searchIds.push(hitId);
      }
    });

    return searchIds;
  } catch (e) {
    console.log('getAlgoliaProductsSearch error ', e);
    return searchIds;
  }
}
