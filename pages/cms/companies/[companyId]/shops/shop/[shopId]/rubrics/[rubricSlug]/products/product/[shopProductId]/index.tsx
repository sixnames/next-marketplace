import CompanyProductDetails from 'components/company/CompanyProductDetails';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import ConsoleShopProductLayout from 'components/layout/console/ConsoleShopProductLayout';
import RequestError from 'components/RequestError';
import { getDbCollections } from 'db/mongodb';
import { getConsoleShopProduct } from 'db/ssr/shops/getConsoleShopProduct';
import {
  AppContentWrapperBreadCrumbs,
  CompanyInterface,
  ShopProductInterface,
} from 'db/uiInterfaces';
import { getProjectLinks } from 'lib/links/getProjectLinks';

import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

interface ProductDetailsInterface {
  shopProduct: ShopProductInterface;
  companySlug?: string;
  pageCompany: CompanyInterface;
}

const ProductDetails: React.FC<ProductDetailsInterface> = ({
  shopProduct,
  pageCompany,
  companySlug,
}) => {
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
    rubricSlug: rubric?.slug,
    productId: shopProduct._id,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${snippetTitle}`,
    config: [
      {
        name: 'Компании',
        href: links.cms.companies.url,
      },
      {
        name: `${pageCompany.name}`,
        href: links.cms.companies.companyId.url,
      },
      {
        name: 'Магазины',
        href: links.cms.companies.companyId.shops.url,
      },
      {
        name: shop.name,
        href: links.cms.companies.companyId.shops.shop.shopId.url,
      },
      {
        name: 'Товары',
        href: links.cms.companies.companyId.shops.shop.shopId.rubrics.url,
      },
      {
        name: `${rubric?.name}`,
        href: links.cms.companies.companyId.shops.shop.shopId.rubrics.rubricSlug.url,
      },
    ],
  };

  return (
    <ConsoleShopProductLayout showEditButton breadcrumbs={breadcrumbs} shopProduct={shopProduct}>
      <CompanyProductDetails
        routeBasePath={''}
        product={summary}
        seoContentsList={cardContentCities}
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
  const collections = await getDbCollections();
  const companiesCollection = collections.companiesCollection();
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
      pageCompany: castDbData(companyResult),
    },
  };
};

export default Product;
