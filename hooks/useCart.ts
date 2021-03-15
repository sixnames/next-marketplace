import * as React from 'react';
import { ApolloError } from '@apollo/client';
import { CartFragment, useSessionCartQuery } from 'generated/apolloComponents';

export interface UseCartPayloadInterface {
  cart?: CartFragment | null;
  loadingCart: boolean;
  cartError: ApolloError | undefined;
}

const useCart = (): UseCartPayloadInterface => {
  const { data, loading, error } = useSessionCartQuery();

  const cart = React.useMemo(() => {
    return data?.getSessionCart;
  }, [data]);

  return {
    cart,
    loadingCart: loading,
    cartError: error,
  };
};

export default useCart;
