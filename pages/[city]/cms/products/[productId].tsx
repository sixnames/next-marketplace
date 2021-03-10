import DataLayout from 'components/DataLayout/DataLayout';
import DataLayoutContentFrame from 'components/DataLayout/DataLayoutContentFrame';
import RequestError from 'components/RequestError/RequestError';
import Spinner from 'components/Spinner/Spinner';
import TabsContent from 'components/TabsContent/TabsContent';
import { useGetProductQuery } from 'generated/apolloComponents';
import useRouterQuery from 'hooks/useRouterQuery';
import useTabsConfig from 'hooks/useTabsConfig';
import * as React from 'react';
import AppLayout from 'layout/AppLayout/AppLayout';
import { NextPage } from 'next';
import { getAppInitialData } from 'lib/ssrUtils';
import ProductAssets from 'routes/Product/ProductAssets';
import ProductConnections from 'routes/Product/ProductConnections';
import ProductDetails from 'routes/Product/ProductDetails';
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
      withTabs={true}
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

const Product: NextPage = () => {
  return (
    <AppLayout>
      <ProductRoute />
    </AppLayout>
  );
};

export const getServerSideProps = getAppInitialData;

export default Product;
