import { useMemo } from 'react';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { createUploadLink } from 'apollo-upload-client';
let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

const isBrowser = typeof window !== 'undefined';
const buildEnv = process.env.NEXT_NODE_ENV;
const testingApiUri = isBrowser ? process.env.API_BROWSER_HOST : process.env.API_HOST;
const apiUri = buildEnv === 'testing' ? testingApiUri : process.env.PRODUCTION_API_HOST;

function createApolloClient() {
  return new ApolloClient({
    ssrMode: !isBrowser,
    link: createUploadLink({
      uri: apiUri || 'http://localhost:4000/graphql',
      credentials: 'include',
    }),
    cache: new InMemoryCache(),
  });
}

export function initializeApollo(
  initialState?: NormalizedCacheObject,
): ApolloClient<NormalizedCacheObject> {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client, the INITIAL_QUERY state
  // get hydrated here
  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState: NormalizedCacheObject) {
  return useMemo(() => initializeApollo(initialState), [initialState]);
}
