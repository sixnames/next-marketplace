import * as React from 'react';
import { ShopProductInterface } from '../db/uiInterfaces';

export interface UseGetSimilarProductsInterface {
  productId: any;
}

export interface UseGetSimilarProductsPayloadInterface {
  similarProducts: ShopProductInterface[];
  loading: boolean;
}

const useGetSimilarProducts = ({
  productId,
}: UseGetSimilarProductsInterface): UseGetSimilarProductsPayloadInterface => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [similarProducts, setSimilarProducts] = React.useState<ShopProductInterface[]>([]);

  React.useEffect(() => {
    fetch(`/api/catalogue/get-product-similar-items?productId=${productId}`)
      .then((res) => res.json())
      .then((res: ShopProductInterface[]) => {
        if (res && res.length > 0) {
          setSimilarProducts(res);
        }
      })
      .catch(() => {
        setLoading(false);
      });

    return () => {
      setSimilarProducts([]);
    };
  }, [productId]);

  return {
    similarProducts,
    loading,
  };
};

export default useGetSimilarProducts;
