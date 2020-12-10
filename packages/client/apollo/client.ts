import { useMemo } from 'react';
import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { GRAPHQL_API_PATH } from '../config';

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

function createIsomorphLink() {
  const { createUploadLink } = require('apollo-upload-client');
  return createUploadLink({
    uri: GRAPHQL_API_PATH,
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

export function initializeApollo(): ApolloClient<NormalizedCacheObject> {
  const _apolloClient = apolloClient ?? createApolloClient();

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') {
    return _apolloClient;
  }
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo() {
  return useMemo(() => initializeApollo(), []);
}
