import algoliasearch from 'algoliasearch';
import { SearchClient, SearchIndex } from 'algoliasearch/dist/algoliasearch';

require('dotenv').config();

interface GetAlgoliaClientPayloadInterface {
  algoliaClient: SearchClient;
  algoliaIndex: SearchIndex;
}

export const getAlgoliaClient = (indexName: string): GetAlgoliaClientPayloadInterface => {
  const appId = process.env.ALGOLIA_APP_ID;
  const apiKey = process.env.ALGOLIA_API_KEY;
  if (!appId || !apiKey) {
    throw Error('No env variables in getAlgoliaClient');
  }
  const algoliaClient = algoliasearch(`${appId}`, `${apiKey}`);
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
