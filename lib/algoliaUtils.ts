import algoliasearch from 'algoliasearch';
import { SearchClient, SearchIndex } from 'algoliasearch/dist/algoliasearch';

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
