import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';
import ConsoleRubricProductConnections from '../../../../../../../../../components/console/ConsoleRubricProductConnections';
import { ROUTE_CMS } from '../../../../../../../../../config/common';
import { COL_COMPANIES } from '../../../../../../../../../db/collectionNames';
import { getDatabase } from '../../../../../../../../../db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  CompanyInterface,
  ProductSummaryInterface,
} from '../../../../../../../../../db/uiInterfaces';
import CmsProductLayout from '../../../../../../../../../layout/cms/CmsProductLayout';
import ConsoleLayout from '../../../../../../../../../layout/cms/ConsoleLayout';
import { getCmsProduct } from '../../../../../../../../../lib/productUtils';
import {
  castDbData,
  getAppInitialData,
  GetAppInitialDataPropsInterface,
} from '../../../../../../../../../lib/ssrUtils';

interface ProductConnectionsPropsInterface {
  product: ProductSummaryInterface;
  pageCompany: CompanyInterface;
  routeBasePath: string;
}

const ProductConnections: React.FC<ProductConnectionsPropsInterface> = ({
  product,
  pageCompany,
  routeBasePath,
}) => {
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Связи',
    config: [
      {
        name: 'Компании',
        href: `${ROUTE_CMS}/companies`,
      },
      {
        name: `${pageCompany?.name}`,
        href: routeBasePath,
      },
      {
        name: `Рубрикатор`,
        href: `${routeBasePath}/rubrics`,
      },
      {
        name: `${product.rubric?.name}`,
        href: `${routeBasePath}/rubrics/${product.rubric?._id}`,
      },
      {
        name: `Товары`,
        href: `${routeBasePath}/rubrics/${product.rubric?._id}/products/${product.rubric?._id}`,
      },
      {
        name: `${product.snippetTitle}`,
        href: `${routeBasePath}/rubrics/${product.rubric?._id}/products/product/${product._id}`,
      },
    ],
  };

  return (
    <CmsProductLayout
      companySlug={pageCompany.slug}
      product={product}
      breadcrumbs={breadcrumbs}
      basePath={routeBasePath}
    >
      <ConsoleRubricProductConnections product={product} />
    </CmsProductLayout>
  );
};

interface ProductPageInterface
  extends GetAppInitialDataPropsInterface,
    ProductConnectionsPropsInterface {}

const Product: NextPage<ProductPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <ProductConnections {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProductPageInterface>> => {
  const { query } = context;
  const { productId, rubricId } = query;
  const { db } = await getDatabase();
  const companiesCollection = db.collection<CompanyInterface>(COL_COMPANIES);
  const { props } = await getAppInitialData({ context });
  if (!props || !productId || !rubricId || !query.companyId) {
    return {
      notFound: true,
    };
  }

  // get company
  const companyId = new ObjectId(`${query.companyId}`);
  const companyAggregationResult = await companiesCollection
    .aggregate([
      {
        $match: {
          _id: companyId,
        },
      },
    ])
    .toArray();
  const companyResult = companyAggregationResult[0];
  if (!companyResult) {
    return {
      notFound: true,
    };
  }

  const payload = await getCmsProduct({
    locale: props.sessionLocale,
    productId: `${productId}`,
    companySlug: companyResult.slug,
  });

  if (!payload) {
    return {
      notFound: true,
    };
  }

  const { product } = payload;

  return {
    props: {
      ...props,
      product: castDbData(product),
      pageCompany: castDbData(companyResult),
      routeBasePath: `${ROUTE_CMS}/companies/${companyResult._id}`,
    },
  };
};

export default Product;
