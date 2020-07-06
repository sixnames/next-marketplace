import { useMemo } from 'react';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { createUploadLink } from 'apollo-upload-client';
import { GRAPHQL_API_PATH, IS_BROWSER, API_URI } from '../config';
let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

function createApolloClient() {
  return new ApolloClient({
    ssrMode: !IS_BROWSER,
    link: createUploadLink({
      uri: API_URI || GRAPHQL_API_PATH,
      credentials: 'include',
    }),
    cache: new InMemoryCache(),
  });
}

export function initializeApollo(
  initialState?: NormalizedCacheObject,
): ApolloClient<NormalizedCacheObject> {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client,
  // the INITIAL_QUERY state get hydrated here
  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }

  // For SSG and SSR always create a new Apollo Client
  if (!IS_BROWSER) return _apolloClient;

  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState: NormalizedCacheObject) {
  return useMemo(() => initializeApollo(initialState), [initialState]);
}
