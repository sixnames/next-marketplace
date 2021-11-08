import CompanyProductDetails, {
  CompanyProductDetailsInterface,
} from 'components/company/CompanyProductDetails';
import { DEFAULT_CITY, PAGE_EDITOR_DEFAULT_VALUE_STRING, ROUTE_CONSOLE } from 'config/common';
import { COL_PRODUCT_CARD_CONTENTS } from 'db/collectionNames';
import { ProductCardContentModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsProductLayout from 'layout/cms/CmsProductLayout';
import { getCmsProduct } from 'lib/productUtils';
import { ObjectId } from 'mongodb';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getConsoleInitialData } from 'lib/ssrUtils';
import ConsoleLayout from 'layout/console/ConsoleLayout';

interface ProductDetailsInterface extends CompanyProductDetailsInterface {
  cardContent: ProductCardContentModel;
}

const ProductDetails: React.FC<ProductDetailsInterface> = ({
  product,
  routeBasePath,
  currentCompany,
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
        currentCompany={currentCompany}
        cardContent={cardContent}
      />
    </CmsProductLayout>
  );
};

interface ProductPageInterface extends PagePropsInterface, ProductDetailsInterface {}

const Product: NextPage<ProductPageInterface> = ({ pageUrls, ...props }) => {
  return (
    <ConsoleLayout pageUrls={pageUrls} company={props.pageCompany}>
      <ProductDetails {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProductPageInterface>> => {
  const { db } = await getDatabase();
  const { query } = context;
  const { productId, rubricId } = query;
  const { props } = await getConsoleInitialData({ context });

  if (!props || !productId || !rubricId || !query.companyId) {
    return {
      notFound: true,
    };
  }

  // get company
  const companySlug = props.pageCompany.slug;

  const payload = await getCmsProduct({
    locale: props.sessionLocale,
    productId: `${productId}`,
    companySlug,
  });

  if (!payload) {
    return {
      notFound: true,
    };
  }

  const productCardContentsCollection =
    db.collection<ProductCardContentModel>(COL_PRODUCT_CARD_CONTENTS);
  let cardContent = await productCardContentsCollection.findOne({
    productId: payload.product._id,
    companySlug,
  });
  if (!cardContent) {
    cardContent = {
      _id: new ObjectId(),
      productId: payload.product._id,
      productSlug: payload.product.slug,
      companySlug,
      assetKeys: [],
      content: {
        [DEFAULT_CITY]: PAGE_EDITOR_DEFAULT_VALUE_STRING,
      },
    };
  }

  return {
    props: {
      ...props,
      product: castDbData(payload.product),
      cardContent: castDbData(cardContent),
      routeBasePath: `${ROUTE_CONSOLE}/${props.pageCompany._id}`,
    },
  };
};

export default Product;
