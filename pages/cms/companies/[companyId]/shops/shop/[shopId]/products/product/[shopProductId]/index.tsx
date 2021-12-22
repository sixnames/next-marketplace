import { ObjectId } from 'mongodb';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import CompanyProductDetails from '../../../../../../../../../../components/company/CompanyProductDetails';
import RequestError from '../../../../../../../../../../components/RequestError';
import { ROUTE_CMS } from '../../../../../../../../../../config/common';
import { COL_COMPANIES } from '../../../../../../../../../../db/collectionNames';
import { getDatabase } from '../../../../../../../../../../db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  CompanyInterface,
  ShopProductInterface,
} from '../../../../../../../../../../db/uiInterfaces';
import ConsoleShopProductLayout from '../../../../../../../../../../layout/console/ConsoleShopProductLayout';
import { getConsoleShopProduct } from '../../../../../../../../../../lib/productUtils';
import {
  castDbData,
  getAppInitialData,
  GetAppInitialDataPropsInterface,
} from '../../../../../../../../../../lib/ssrUtils';
import ConsoleLayout from '../../../../../../../../../../layout/cms/ConsoleLayout';

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

  const companyBasePath = `${ROUTE_CMS}/companies/${shopProduct.companyId}`;
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${snippetTitle}`,
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
    ],
  };

  return (
    <ConsoleShopProductLayout
      showEditButton
      breadcrumbs={breadcrumbs}
      shopProduct={shopProduct}
      basePath={`${companyBasePath}/shops/shop/${shopProduct.shopId}/products/product`}
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

interface ProductPageInterface extends GetAppInitialDataPropsInterface, ProductDetailsInterface {}

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
  const { db } = await getDatabase();
  const companiesCollection = db.collection<CompanyInterface>(COL_COMPANIES);
  const { props } = await getAppInitialData({ context });
  if (!props || !shopProductId || !companyId || !shopId) {
    return {
      notFound: true,
    };
  }

  const companyResult = await companiesCollection.findOne({
    _id: new ObjectId(`${companyId}`),
  });
  if (!companyResult) {
    return {
      notFound: true,
    };
  }

  const shopProductResult = await getConsoleShopProduct({
    shopProductId,
    locale: props.sessionLocale,
    companySlug: companyResult.slug,
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
