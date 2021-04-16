import Inner from 'components/Inner/Inner';
import { COL_PRODUCTS } from 'db/collectionNames';
import { ProductModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import CmsProductLayout from 'layout/CmsLayout/CmsProductLayout';
import { ObjectId } from 'mongodb';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
// import ProductDetails from 'routes/Product/ProductDetails';

interface ProductDetailsInterface {
  product: ProductModel;
}

const ProductDetails: React.FC<ProductDetailsInterface> = ({ product }) => {
  return (
    <CmsProductLayout product={product}>
      <Inner>{product.originalName}</Inner>
    </CmsProductLayout>
  );

  /*return (
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
  );*/
};

interface ProductPageInterface extends PagePropsInterface, ProductDetailsInterface {}

const Product: NextPage<ProductPageInterface> = ({ pageUrls, product }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <ProductDetails product={product} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProductPageInterface>> => {
  const { query } = context;
  const { productId } = query;
  const db = await getDatabase();
  const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
  const { props } = await getAppInitialData({ context, isCms: true });
  if (!props || !productId) {
    return {
      notFound: true,
    };
  }

  const productAggregation = await productsCollection
    .aggregate([
      {
        $match: {
          _id: new ObjectId(`${productId}`),
        },
      },
    ])
    .toArray();
  const product = productAggregation[0];
  if (!product) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...props,
      product: castDbData(product),
    },
  };
};

export default Product;
