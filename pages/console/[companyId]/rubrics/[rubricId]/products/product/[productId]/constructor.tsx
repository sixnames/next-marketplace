import CompanyProductConstructor, {
  CompanyProductConstructorInterface,
} from 'components/CompanyProductConstructor';
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

interface ProductConstructorConsumerInterface extends CompanyProductConstructorInterface {}

const ProductConstructorConsumer: React.FC<ProductConstructorConsumerInterface> = ({
  product,
  rubric,
  cardContent,
  currentCompany,
  routeBasePath,
}) => {
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Контент карточки',
    config: [
      {
        name: `Рубрикатор`,
        href: `${routeBasePath}/rubrics`,
      },
      {
        name: `${rubric.name}`,
        href: `${routeBasePath}/rubrics/${rubric._id}`,
      },
      {
        name: `Товары`,
        href: `${routeBasePath}/rubrics/${rubric._id}/products/${rubric._id}`,
      },
      {
        name: `${product.cardTitle}`,
        href: `${routeBasePath}/rubrics/${rubric._id}/products/product/${product._id}`,
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
      product={product}
      basePath={routeBasePath}
      breadcrumbs={breadcrumbs}
    >
      <CompanyProductConstructor
        product={product}
        rubric={rubric}
        cardContent={cardContent}
        routeBasePath={routeBasePath}
        currentCompany={currentCompany}
      />
    </CmsProductLayout>
  );
};

interface ProductConstructorPageInterface
  extends PagePropsInterface,
    ProductConstructorConsumerInterface {}

const ProductConstructor: NextPage<ProductConstructorPageInterface> = ({ pageUrls, ...props }) => {
  return (
    <ConsoleLayout pageUrls={pageUrls} company={props.currentCompany}>
      <ProductConstructorConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProductConstructorPageInterface>> => {
  const { query } = context;
  const { productId, rubricId } = query;
  const { db } = await getDatabase();
  const productCardContentsCollection =
    db.collection<ProductCardContentModel>(COL_PRODUCT_CARD_CONTENTS);
  const { props } = await getConsoleInitialData({ context });
  if (!props || !productId || !rubricId) {
    return {
      notFound: true,
    };
  }
  const companySlug = props.currentCompany.slug;

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

  const { product, rubric } = payload;

  let cardContent = await productCardContentsCollection.findOne({
    productId: product._id,
    companySlug,
  });

  if (!cardContent) {
    cardContent = {
      _id: new ObjectId(),
      productId: product._id,
      productSlug: product.slug,
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
      product: castDbData(product),
      rubric: castDbData(rubric),
      cardContent: castDbData(cardContent),
      routeBasePath: `${ROUTE_CONSOLE}/${props.currentCompany._id}`,
    },
  };
};

export default ProductConstructor;
