import algoliasearch from 'algoliasearch';
import { SearchClient, SearchIndex } from 'algoliasearch/dist/algoliasearch';
import { HITS_PER_PAGE } from 'config/common';
import { ProductModel, ShopProductModel } from 'db/dbModels';
import { ProductInterface, ShopProductInterface } from 'db/uiInterfaces';
import { ObjectId } from 'mongodb';

export interface AlgoliaProductInterface
  extends Pick<
    ProductModel,
    'nameI18n' | 'originalName' | 'itemId' | 'barcode' | 'descriptionI18n'
  > {
  _id: string;
  objectID: string;
}

export interface AlgoliaShopProductInterface
  extends Pick<
    ShopProductModel,
    'nameI18n' | 'originalName' | 'itemId' | 'barcode' | 'descriptionI18n'
  > {
  _id: string;
  objectID: string;
}

interface GetAlgoliaClientPayloadInterface {
  algoliaClient: SearchClient;
  algoliaIndex: SearchIndex;
}

export const getAlgoliaClient = (indexName: string): GetAlgoliaClientPayloadInterface => {
  const algoliaClient = algoliasearch(
    `${process.env.ALGOLIA_APP_ID}`,
    `${process.env.ALGOLIA_API_KEY}`,
  );
  const algoliaIndex = algoliaClient.initIndex(indexName);
  return {
    algoliaClient,
    algoliaIndex,
  };
};

interface AlgoliaObjectInterface extends Record<string, any> {
  objectID: string;
}

interface SaveAlgoliaObjectsInterface {
  indexName: string;
  objects: AlgoliaObjectInterface[];
}

export const saveAlgoliaObjects = async ({ indexName, objects }: SaveAlgoliaObjectsInterface) => {
  try {
    const { algoliaIndex } = getAlgoliaClient(indexName);
    const saveResult = await algoliaIndex.saveObjects(objects);
    if (saveResult.objectIDs.length < objects.length) {
      return false;
    }
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

interface DeleteAlgoliaObjectsInterface {
  indexName: string;
  objectIDs: string[];
}

export const deleteAlgoliaObjects = async ({
  indexName,
  objectIDs,
}: DeleteAlgoliaObjectsInterface) => {
  try {
    const { algoliaIndex } = getAlgoliaClient(indexName);
    const saveResult = await algoliaIndex.deleteObjects(objectIDs);
    if (saveResult.objectIDs.length < objectIDs.length) {
      return false;
    }
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

interface GetAlgoliaProductsSearch {
  indexName: string;
  search: string;
  excludedProductsIds?: ObjectId[] | null;
}

export const getAlgoliaProductsSearch = async ({
  indexName,
  search,
  excludedProductsIds,
}: GetAlgoliaProductsSearch): Promise<ObjectId[]> => {
  const { algoliaIndex } = getAlgoliaClient(indexName);
  const searchIds: ObjectId[] = [];
  try {
    const { hits } = await algoliaIndex.search<ProductInterface | ShopProductInterface>(
      `${search}`,
      {
        hitsPerPage: HITS_PER_PAGE,
        // optionalWords: `${search}`.split(' ').slice(1),
      },
    );
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
    console.log(e);
    return searchIds;
  }
};
