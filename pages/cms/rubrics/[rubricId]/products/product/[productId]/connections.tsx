import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';
import ConsoleRubricProductConnections from '../../../../../../../components/console/ConsoleRubricProductConnections';
import { DEFAULT_COMPANY_SLUG, ROUTE_CMS } from '../../../../../../../config/common';
import {
  AppContentWrapperBreadCrumbs,
  ProductSummaryInterface,
} from '../../../../../../../db/uiInterfaces';
import CmsProductLayout from '../../../../../../../layout/cms/CmsProductLayout';
import ConsoleLayout from '../../../../../../../layout/cms/ConsoleLayout';
import { getCmsProduct } from '../../../../../../../lib/productUtils';
import {
  castDbData,
  getAppInitialData,
  GetAppInitialDataPropsInterface,
} from '../../../../../../../lib/ssrUtils';

interface ProductConnectionsPropsInterface {
  product: ProductSummaryInterface;
}

const ProductConnections: React.FC<ProductConnectionsPropsInterface> = ({ product }) => {
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Связи',
    config: [
      {
        name: 'Рубрикатор',
        href: `${ROUTE_CMS}/rubrics`,
      },
      {
        name: `${product.rubric?.name}`,
        href: `${ROUTE_CMS}/rubrics/${product.rubric?._id}`,
      },
      {
        name: `Товары`,
        href: `${ROUTE_CMS}/rubrics/${product.rubric?._id}/products/${product.rubric?._id}`,
      },
      {
        name: `${product.cardTitle}`,
        href: `${ROUTE_CMS}/rubrics/${product.rubric?._id}/products/product/${product._id}`,
      },
    ],
  };

  return (
    <CmsProductLayout product={product} breadcrumbs={breadcrumbs}>
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
  const { props } = await getAppInitialData({ context });
  if (!props || !productId || !rubricId) {
    return {
      notFound: true,
    };
  }

  const payload = await getCmsProduct({
    locale: props.sessionLocale,
    productId: `${productId}`,
    companySlug: DEFAULT_COMPANY_SLUG,
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
    },
  };
};

export default Product;
