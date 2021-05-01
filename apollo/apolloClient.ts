import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import * as React from 'react';

let apolloClient: ApolloClient<NormalizedCacheObject>;

function createIsomorphicLInk(ctx?: any) {
  if (typeof window === 'undefined') {
    // on server
    const { SchemaLink } = require('@apollo/client/link/schema');
    const { schema } = require('../schema/schema');

    return new SchemaLink({ schema, context: ctx });
  } else {
    // on client
    const { HttpLink } = require('@apollo/client/link/http');
    return new HttpLink({
      uri: '/api/graphql',
      credentials: 'same-origin',
    });
  }
}

function createApolloClient(ctx?: any) {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    cache: new InMemoryCache(),
    link: createIsomorphicLInk(ctx),
  });
}

export function initializeApollo(initialState: NormalizedCacheObject | null = null, ctx?: any) {
  let client = apolloClient;
  const _apolloClient = client ?? createApolloClient(ctx);

  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }

  if (typeof window === 'undefined') {
    return _apolloClient;
  }

  client = client ?? _apolloClient;

  return client;
}

export function useApollo(initialState: NormalizedCacheObject | null = null) {
  return React.useMemo(() => {
    return initializeApollo(initialState, null);
  }, [initialState]);
}
