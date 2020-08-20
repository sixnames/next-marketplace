import { useMemo } from 'react';
import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { GRAPHQL_API_PATH, API_URI } from '../config';

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

function createIsomorphLink() {
  // for api routes
  /*if (typeof window === 'undefined') {
    const { SchemaLink } = require('@apollo/client/link/schema');
    const { schema } = require('./schema');
    return new SchemaLink({ schema });
  } else {
    const { createUploadLink } = require('apollo-upload-client');
    return createUploadLink({
      uri: API_URI || GRAPHQL_API_PATH,
      credentials: 'include',
    });
  }*/

  const { createUploadLink } = require('apollo-upload-client');
  return createUploadLink({
    uri: API_URI || GRAPHQL_API_PATH,
    credentials: 'include',
  });
}

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: createIsomorphLink(),
    cache: new InMemoryCache(),
  });
}

// TODO cache store
export function initializeApollo(): ApolloClient<NormalizedCacheObject> {
  // initialState?: NormalizedCacheObject,
  const _apolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client,
  // the INITIAL_QUERY state get hydrated here
  /*if (initialState) {
    _apolloClient.cache.restore(initialState);
  }*/

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

/*export function useApollo(initialState: NormalizedCacheObject) {
  return useMemo(() => initializeApollo(initialState), [initialState]);
}*/

export function useApollo() {
  return useMemo(() => initializeApollo(), []);
}
