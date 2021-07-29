import { ProductInterface } from 'db/uiInterfaces';
import * as React from 'react';

export interface UseGetSimilarProductsInterface {
  productId: any;
  companyId?: any | null;
}

export interface UseGetSimilarProductsPayloadInterface {
  similarProducts: ProductInterface[];
  loading: boolean;
}

const useGetSimilarProducts = ({
  productId,
  companyId,
}: UseGetSimilarProductsInterface): UseGetSimilarProductsPayloadInterface => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [similarProducts, setSimilarProducts] = React.useState<ProductInterface[]>([]);

  React.useEffect(() => {
    fetch(
      `/api/catalogue/get-product-similar-items?productId=${productId}${
        companyId ? `&companyId=${companyId}` : ''
      }`,
    )
      .then((res) => res.json())
      .then((res: ProductInterface[]) => {
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
  }, [productId, companyId]);

  return {
    similarProducts,
    loading,
  };
};

export default useGetSimilarProducts;
