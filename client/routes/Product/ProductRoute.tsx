import React from 'react';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import TabsContent from '../../components/TabsContent/TabsContent';
import ProductDetails from './ProductDetails';
import useRouterQuery from '../../hooks/useRouterQuery';
import { useGetProductQuery } from '../../generated/apolloComponents';
import { NavItemInterface } from '../../types';
import DataLayout from '../../components/DataLayout/DataLayout';
import useTabsConfig from '../../hooks/useTabsConfig';

const ProductRoute: React.FC = () => {
  const { query } = useRouterQuery();
  const { generateTabsConfig } = useTabsConfig();
  const { id } = query;
  const { data, loading, error } = useGetProductQuery({
    skip: !id,
    variables: {
      id: `${id}`,
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
        name: 'Tab 2',
        testId: 'tab-2',
      },
      {
        name: 'Tab 3',
        testId: 'tab-3',
      },
    ],
  });

  return (
    <DataLayout
      filterResultNavConfig={navConfig}
      title={product.nameString}
      filterResult={() => (
        <TabsContent>
          <ProductDetails product={product} />
          <div>Tab 1</div>
          <div>Tab 2</div>
        </TabsContent>
      )}
    />
  );
};

export default ProductRoute;
