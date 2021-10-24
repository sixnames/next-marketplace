import CompanyProductConstructor, {
  CompanyProductConstructorInterface,
} from 'components/CompanyProductConstructor';
import { DEFAULT_CITY, PAGE_EDITOR_DEFAULT_VALUE_STRING, ROUTE_CMS } from 'config/common';
import { COL_COMPANIES, COL_PRODUCT_CARD_CONTENTS } from 'db/collectionNames';
import { ProductCardContentModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { CompanyInterface } from 'db/uiInterfaces';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsProductLayout from 'layout/cms/CmsProductLayout';
import { getCmsProduct } from 'lib/productUtils';
import { ObjectId } from 'mongodb';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import CmsLayout from 'layout/cms/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';

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
        name: 'Компании',
        href: `${ROUTE_CMS}/companies`,
      },
      {
        name: `${currentCompany?.name}`,
        href: routeBasePath,
      },
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
    <CmsLayout pageUrls={pageUrls}>
      <ProductConstructorConsumer {...props} />
    </CmsLayout>
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
  const companiesCollection = db.collection<CompanyInterface>(COL_COMPANIES);
  const { props } = await getAppInitialData({ context });
  if (!props || !productId || !rubricId || !query.companyId) {
    return {
      notFound: true,
    };
  }

  // get company
  const companyId = new ObjectId(`${query.companyId}`);
  const companyAggregationResult = await companiesCollection
    .aggregate([
      {
        $match: {
          _id: companyId,
        },
      },
    ])
    .toArray();
  const companyResult = companyAggregationResult[0];
  if (!companyResult) {
    return {
      notFound: true,
    };
  }
  const companySlug = companyResult.slug;

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
      currentCompany: castDbData(companyResult),
      routeBasePath: `${ROUTE_CMS}/companies/${companyResult._id}`,
    },
  };
};

export default ProductConstructor;
