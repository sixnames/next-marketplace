import Inner from 'components/Inner';
import RequestError from 'components/RequestError';
import { ROUTE_CMS } from 'config/common';
import { ShopProductInterface } from 'db/uiInterfaces';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsLayout from 'layout/cms/CmsLayout';
import ConsoleShopProductLayout from 'layout/console/ConsoleShopProductLayout';
import { getConsoleShopProduct } from 'lib/productUtils';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';

interface ProductDetailsInterface {
  shopProduct: ShopProductInterface;
}

const ProductDetails: React.FC<ProductDetailsInterface> = ({ shopProduct }) => {
  const { product, shop, company } = shopProduct;
  if (!product || !shop || !company) {
    return <RequestError />;
  }

  const { rubric, snippetTitle } = product;
  if (!rubric) {
    return <RequestError />;
  }

  const companyBasePath = `${ROUTE_CMS}/companies/${shopProduct.companyId}`;
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Поставщики',
    config: [
      {
        name: 'Компании',
        href: `${ROUTE_CMS}/companies`,
      },
      {
        name: `${company.name}`,
        href: companyBasePath,
      },
      {
        name: 'Магазины',
        href: `${companyBasePath}/shops/${shop.companyId}`,
      },
      {
        name: shop.name,
        href: `${companyBasePath}/shops/shop/${shop._id}`,
      },
      {
        name: 'Товары',
        href: `${companyBasePath}/shops/shop/${shop._id}/products`,
      },
      {
        name: `${rubric?.name}`,
        href: `${companyBasePath}/shops/shop/${shop._id}/products/${rubric?._id}`,
      },
      {
        name: `${snippetTitle}`,
        href: `${companyBasePath}/shops/shop/${shop._id}/products/${rubric?._id}/${shopProduct._id}`,
      },
    ],
  };

  console.log(shopProduct.supplierProducts);

  return (
    <ConsoleShopProductLayout
      breadcrumbs={breadcrumbs}
      shopProduct={shopProduct}
      basePath={`${companyBasePath}/shops/shop/${shopProduct.shopId}/products/product`}
    >
      <Inner testId={'shop-product-shuppliers-list'}>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. A cupiditate nobis provident qui,
        quisquam temporibus ut vel. Aspernatur, commodi dolore eaque eos ex explicabo iusto, natus
        quae, quasi rem vero?
      </Inner>
    </ConsoleShopProductLayout>
  );
};

interface ProductPageInterface extends PagePropsInterface, ProductDetailsInterface {}

const Product: NextPage<ProductPageInterface> = ({ pageUrls, shopProduct }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <ProductDetails shopProduct={shopProduct} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProductPageInterface>> => {
  const { query } = context;
  const { shopProductId, companyId, shopId } = query;
  const { props } = await getAppInitialData({ context });
  if (!props || !shopProductId || !companyId || !shopId) {
    return {
      notFound: true,
    };
  }

  const shopProduct = await getConsoleShopProduct({
    shopProductId,
    locale: props.sessionLocale,
  });
  if (!shopProduct) {
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
