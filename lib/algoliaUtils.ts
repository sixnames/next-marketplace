import algoliasearch from 'algoliasearch';
import { SearchClient, SearchIndex } from 'algoliasearch/dist/algoliasearch';
import { ProductModel } from 'db/dbModels';

export interface AlgoliaProductInterface
  extends Pick<ProductModel, 'nameI18n' | 'originalName' | 'itemId' | 'barcode'> {
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
