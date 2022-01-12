import { ObjectId } from 'mongodb';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import CompanyProductDetails from '../../../../../../../../../../../../components/company/CompanyProductDetails';
import RequestError from '../../../../../../../../../../../../components/RequestError';
import { COL_COMPANIES } from '../../../../../../../../../../../../db/collectionNames';
import { getDatabase } from '../../../../../../../../../../../../db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  CompanyInterface,
  ShopProductInterface,
} from '../../../../../../../../../../../../db/uiInterfaces';
import ConsoleShopProductLayout from '../../../../../../../../../../../../layout/console/ConsoleShopProductLayout';
import { getCmsCompanyLinks } from '../../../../../../../../../../../../lib/linkUtils';
import { getConsoleShopProduct } from '../../../../../../../../../../../../lib/productUtils';
import {
  castDbData,
  getAppInitialData,
  GetAppInitialDataPropsInterface,
} from '../../../../../../../../../../../../lib/ssrUtils';
import ConsoleLayout from '../../../../../../../../../../../../layout/cms/ConsoleLayout';

interface ProductDetailsInterface {
  shopProduct: ShopProductInterface;
  companySlug: string;
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

  const links = getCmsCompanyLinks({
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
        href: links.parentLink,
      },
      {
        name: `${pageCompany.name}`,
        href: links.root,
      },
      {
        name: 'Магазины',
        href: links.shop.parentLink,
      },
      {
        name: shop.name,
        href: links.shop.root,
      },
      {
        name: 'Товары',
        href: links.shop.rubrics.parentLink,
      },
      {
        name: `${rubric?.name}`,
        href: links.shop.rubrics.product.parentLink,
      },
    ],
  };

  return (
    <ConsoleShopProductLayout showEditButton breadcrumbs={breadcrumbs} shopProduct={shopProduct}>
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
      pageCompany: castDbData(companyResult),
    },
  };
};

export default Product;
