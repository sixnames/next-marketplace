import * as React from 'react';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import TabsContent from '../../components/TabsContent/TabsContent';
import ProductDetails from './ProductDetails';
import useRouterQuery from '../../hooks/useRouterQuery';
import { useGetProductQuery } from 'generated/apolloComponents';
import DataLayout from '../../components/DataLayout/DataLayout';
import useTabsConfig from '../../hooks/useTabsConfig';
import ProductConnections from './ProductConnections';
import ProductAssets from './ProductAssets';
import DataLayoutContentFrame from '../../components/DataLayout/DataLayoutContentFrame';
import { NavItemInterface } from 'types/clientTypes';

const ProductRoute: React.FC = () => {
  const { query } = useRouterQuery();
  const { generateTabsConfig } = useTabsConfig();
  const { productId } = query;
  const { data, loading, error } = useGetProductQuery({
    fetchPolicy: 'network-only',
    skip: !productId,
    variables: {
      _id: `${productId}`,
    },
  });

  if (loading) {
    return <Spinner />;
  }

  if (error || !data || !data.getProduct) {
    return <RequestError />;
  }

  const product = data.getProduct;

  // Product nav tabs config
  const navConfig: NavItemInterface[] = generateTabsConfig({
    config: [
      {
        name: 'Детали',
        testId: 'details',
      },
      {
        name: 'Связи',
        testId: 'connections',
      },
      {
        name: 'Изображения',
        testId: 'assets',
      },
    ],
  });

  return (
    <DataLayout
      isFilterVisible
      filterResultNavConfig={navConfig}
      title={product.name}
      filterResult={() => (
        <DataLayoutContentFrame>
          <TabsContent>
            <ProductDetails product={product} />
            <ProductConnections product={product} />
            <ProductAssets product={product} />
          </TabsContent>
        </DataLayoutContentFrame>
      )}
    />
  );
};

export default ProductRoute;
