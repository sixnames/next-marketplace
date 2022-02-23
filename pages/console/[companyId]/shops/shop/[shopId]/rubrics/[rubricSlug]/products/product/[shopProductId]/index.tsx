import CompanyProductDetails from 'components/company/CompanyProductDetails';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import ConsoleShopProductLayout from 'components/layout/console/ConsoleShopProductLayout';
import RequestError from 'components/RequestError';
import { getConsoleShopProduct } from 'db/ssr/shops/getConsoleShopProduct';
import { AppContentWrapperBreadCrumbs, ShopProductInterface } from 'db/uiInterfaces';
import { getProjectLinks } from 'lib/links/getProjectLinks';

import {
  castDbData,
  getConsoleInitialData,
  GetConsoleInitialDataPropsInterface,
} from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

interface ProductDetailsInterface {
  shopProduct: ShopProductInterface;
  companySlug?: string;
}

const ProductDetails: React.FC<ProductDetailsInterface> = ({ shopProduct, companySlug }) => {
  const { summary, shop } = shopProduct;

  if (!summary || !shop) {
    return <RequestError />;
  }

  const { rubric, snippetTitle, cardContentCities } = summary;
  if (!rubric || !cardContentCities) {
    return <RequestError />;
  }

  const links = getProjectLinks({
    companyId: shop.companyId,
    shopId: shop._id,
    rubricSlug: rubric.slug,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${snippetTitle}`,
    config: [
      {
        name: 'Магазины',
        href: links.console.companyId.shops.url,
      },
      {
        name: shop.name,
        href: links.console.companyId.shops.shop.shopId.url,
      },
      {
        name: 'Товары',
        href: links.console.companyId.shops.shop.shopId.rubrics.url,
      },
      {
        name: `${rubric?.name}`,
        href: links.console.companyId.shops.shop.shopId.rubrics.rubricSlug.url,
      },
    ],
  };

  return (
    <ConsoleShopProductLayout shopProduct={shopProduct} breadcrumbs={breadcrumbs}>
      <CompanyProductDetails
        product={summary}
        seoContentsList={cardContentCities}
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
