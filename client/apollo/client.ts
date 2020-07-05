import { useMemo } from 'react';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { createUploadLink } from 'apollo-upload-client';
let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

// TODO make dynamic uri=
function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: createUploadLink({
      // uri: process.env.API_HOST || 'http://localhost:4000/graphql',
      uri: 'http://localhost:4000/graphql',
      // uri: process.env.API_BROWSER_HOST || 'http://localhost:4000/graphql',
      // uri: 'http://localhost:3000/graphql',
      /*uri: process.browser
        ? process.env.API_BROWSER_HOST
        : process.env.API_HOST || 'http://localhost:4000/graphql',*/
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
