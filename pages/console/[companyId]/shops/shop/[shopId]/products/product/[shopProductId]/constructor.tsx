import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import CompanyProductConstructor from '../../../../../../../../../components/company/CompanyProductConstructor';
import RequestError from '../../../../../../../../../components/RequestError';
import { ROUTE_CONSOLE } from '../../../../../../../../../config/common';
import {
  AppContentWrapperBreadCrumbs,
  ShopProductInterface,
} from '../../../../../../../../../db/uiInterfaces';
import ConsoleShopProductLayout from '../../../../../../../../../layout/console/ConsoleShopProductLayout';
import { getConsoleShopProduct } from '../../../../../../../../../lib/productUtils';
import {
  castDbData,
  getConsoleInitialData,
  GetConsoleInitialDataPropsInterface,
} from '../../../../../../../../../lib/ssrUtils';
import ConsoleLayout from '../../../../../../../../../layout/cms/ConsoleLayout';

interface ProductDetailsInterface {
  shopProduct: ShopProductInterface;
}

const ProductDetails: React.FC<ProductDetailsInterface> = ({ shopProduct }) => {
  const { summary, shop, company } = shopProduct;
  if (!summary || !shop || !company) {
    return <RequestError />;
  }

  const { rubric, snippetTitle } = summary;
  if (!rubric) {
    return <RequestError />;
  }

  const companyBasePath = `${ROUTE_CONSOLE}/${shop.companyId}/shops`;
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Контент карточки',
    config: [
      {
        name: 'Магазины',
        href: companyBasePath,
      },
      {
        name: shop.name,
        href: `${companyBasePath}/shop/${shop._id}`,
      },
      {
        name: 'Товары',
        href: `${companyBasePath}/shop/${shop._id}/products`,
      },
      {
        name: `${rubric.name}`,
        href: `${companyBasePath}/shop/${shop._id}/products/${rubric._id}`,
      },
      {
        name: `${snippetTitle}`,
        href: `${companyBasePath}/shop/${shop._id}/products/product/${shopProduct._id}`,
      },
    ],
  };

  return (
    <ConsoleShopProductLayout
      breadcrumbs={breadcrumbs}
      shopProduct={shopProduct}
      basePath={`${companyBasePath}/shop/${shopProduct.shopId}/products/product`}
    >
      <CompanyProductConstructor
        routeBasePath={''}
        product={summary}
        rubric={rubric}
        currentCompany={company}
      />
    </ConsoleShopProductLayout>
  );
};

interface ProductPageInterface
  extends GetConsoleInitialDataPropsInterface,
    ProductDetailsInterface {}

const Product: NextPage<ProductPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <ProductDetails {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProductPageInterface>> => {
  const { query } = context;
  const { shopProductId, companyId, shopId } = query;
  const { props } = await getConsoleInitialData({ context });
  if (!props || !shopProductId || !companyId || !shopId) {
    return {
      notFound: true,
    };
  }

  const shopProduct = await getConsoleShopProduct({
    shopProductId,
    locale: props.sessionLocale,
    companySlug: props.layoutProps.pageCompany.slug,
  });
  if (!shopProduct || !shopProduct.summary) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...props,
      shopProduct: castDbData(shopProduct),
    },
  };
};

export default Product;
