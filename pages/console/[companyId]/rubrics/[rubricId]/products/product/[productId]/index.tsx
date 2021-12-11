import CompanyProductDetails, {
  CompanyProductDetailsInterface,
} from 'components/company/CompanyProductDetails';
import { ROUTE_CONSOLE } from 'config/common';
import { COL_COMPANIES } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { AppContentWrapperBreadCrumbs, CompanyInterface } from 'db/uiInterfaces';
import CmsProductLayout from 'layout/cms/CmsProductLayout';
import { getCmsProduct } from 'lib/productUtils';
import { ObjectId } from 'mongodb';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import {
  castDbData,
  getConsoleInitialData,
  GetConsoleInitialDataPropsInterface,
} from 'lib/ssrUtils';
import ConsoleLayout from 'layout/cms/ConsoleLayout';

interface ProductDetailsInterface extends CompanyProductDetailsInterface {}

const ProductDetails: React.FC<ProductDetailsInterface> = ({
  product,
  routeBasePath,
  companySlug,
  cardContent,
}) => {
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${product.cardTitle}`,
    config: [
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
    ],
  };

  return (
    <CmsProductLayout
      hideAssetsPath
      hideAttributesPath
      hideBrandPath
      hideCategoriesPath
      hideConnectionsPath
      hideCardConstructor
      product={product}
      basePath={routeBasePath}
      breadcrumbs={breadcrumbs}
    >
      <CompanyProductDetails
        routeBasePath={routeBasePath}
        product={product}
        companySlug={companySlug}
        cardContent={cardContent}
      />
    </CmsProductLayout>
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
  const { productId, rubricId, companyId } = query;
  const { db } = await getDatabase();
  const companiesCollection = db.collection<CompanyInterface>(COL_COMPANIES);
  const { props } = await getConsoleInitialData({ context });

  if (!props || !productId || !rubricId || !companyId) {
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

  return {
    props: {
      ...props,
      product: castDbData(payload.product),
      cardContent: castDbData(payload.cardContent),
      companySlug: companyResult.slug,
      routeBasePath: `${ROUTE_CONSOLE}/${props.layoutProps.pageCompany._id}`,
    },
  };
};

export default Product;
