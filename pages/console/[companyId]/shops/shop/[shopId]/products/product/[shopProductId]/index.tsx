import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import CompanyProductDetails from '../../../../../../../../../components/company/CompanyProductDetails';
import RequestError from '../../../../../../../../../components/RequestError';
import { ROUTE_CONSOLE } from '../../../../../../../../../config/common';
import {
  AppContentWrapperBreadCrumbs,
  ShopProductInterface,
} from '../../../../../../../../../db/uiInterfaces';
import ConsoleLayout from '../../../../../../../../../layout/cms/ConsoleLayout';
import ConsoleShopProductLayout from '../../../../../../../../../layout/console/ConsoleShopProductLayout';
import { getConsoleShopProduct } from '../../../../../../../../../lib/productUtils';
import {
  castDbData,
  getConsoleInitialData,
  GetConsoleInitialDataPropsInterface,
} from '../../../../../../../../../lib/ssrUtils';

interface ProductDetailsInterface {
  shopProduct: ShopProductInterface;
  companySlug: string;
}

const ProductDetails: React.FC<ProductDetailsInterface> = ({ shopProduct, companySlug }) => {
  const { summary, shop, company } = shopProduct;
  if (!summary || !shop || !company) {
    return <RequestError />;
  }

  const { rubric, snippetTitle, cardContentCities } = summary;
  if (!rubric || !cardContentCities) {
    return <RequestError />;
  }

  const companyBasePath = `${ROUTE_CONSOLE}/${shop.companyId}/shops`;
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${snippetTitle}`,
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
    ],
  };

  return (
    <ConsoleShopProductLayout
      shopProduct={shopProduct}
      basePath={`${companyBasePath}/shop/${shopProduct.shopId}/products/product`}
      breadcrumbs={breadcrumbs}
    >
      <CompanyProductDetails
        routeBasePath={''}
        product={summary}
        cardContent={cardContentCities}
        companySlug={companySlug}
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
  const { shopProductId } = query;
  const { props } = await getConsoleInitialData({ context });
  if (!props || !shopProductId) {
    return {
      notFound: true,
    };
  }

  const shopProductResult = await getConsoleShopProduct({
    shopProductId,
    locale: props.sessionLocale,
    companySlug: props.layoutProps.pageCompany.slug,
  });
  if (!shopProductResult) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...props,
      shopProduct: castDbData(shopProductResult),
    },
  };
};

export default Product;
