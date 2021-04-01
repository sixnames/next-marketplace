import * as React from 'react';
import { ApolloError } from '@apollo/client';
import { CartFragment, useSessionCartQuery } from 'generated/apolloComponents';

export interface UseCartPayloadInterface {
  cart?: CartFragment | null;
  loadingCart: boolean;
  cartError: ApolloError | undefined;
}

const useCart = (): UseCartPayloadInterface => {
  const { data, loading, error } = useSessionCartQuery({ ssr: false });

  return React.useMemo(() => {
    return {
      cart: data?.getSessionCart,
      loadingCart: loading,
      cartError: error,
    };
  }, [data, error, loading]);
};

export default useCart;
