import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import * as React from 'react';

let apolloClient: ApolloClient<NormalizedCacheObject>;
let cacheLocale: string | undefined | null;

function createIsomorphicLInk(ctx?: any, locale?: string, city?: string) {
  if (typeof window === 'undefined') {
    // on server
    const { SchemaLink } = require('@apollo/client/link/schema');
    const { schema } = require('../schema/schema');
    return new SchemaLink({ schema, context: ctx });
  } else {
    // on client
    const { setContext } = require('apollo-link-context');

    // set locale to headers for request from client
    const setLocaleLink = setContext((_: any, { headers }: any) => {
      return {
        headers: {
          ...headers,
          'Content-Language': locale,
          'x-city': city,
        },
      };
    });

    const { createUploadLink } = require('apollo-upload-client');
    return setLocaleLink.concat(
      createUploadLink({
        uri: '/api/graphql',
        credentials: 'same-origin',
      }),
    );
  }
}

function createApolloClient(ctx?: any, locale?: string, city?: string) {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    cache: new InMemoryCache(),
    link: createIsomorphicLInk(ctx, locale, city),
  });
}

export function initializeApollo(
  initialState: NormalizedCacheObject | null = null,
  ctx?: any,
  locale?: string,
  city?: string,
) {
  let client = apolloClient;

  if (cacheLocale !== locale) {
    client = createApolloClient(ctx, locale, city);
  }

  const _apolloClient = client ?? createApolloClient(ctx, locale, city);

  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }

  if (typeof window === 'undefined') {
    return _apolloClient;
  }

  client = client ?? _apolloClient;

  return client;
}

export function useApollo(
  initialState: NormalizedCacheObject | null = null,
  locale?: string,
  city?: string,
) {
  return React.useMemo(() => {
    return initializeApollo(initialState, null, locale, city);
  }, [city, initialState, locale]);
}
