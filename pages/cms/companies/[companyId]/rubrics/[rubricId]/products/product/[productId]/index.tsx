import ConsoleRubricProductDetails from 'components/console/ConsoleRubricProductDetails';
import { ROUTE_CMS } from 'config/common';
import { COL_COMPANIES } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { CompanyInterface, ProductInterface, RubricInterface } from 'db/uiInterfaces';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsProductLayout from 'layout/cms/CmsProductLayout';
import { getCmsProduct } from 'lib/productUtils';
import { ObjectId } from 'mongodb';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import CmsLayout from 'layout/cms/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';

interface ProductDetailsInterface {
  product: ProductInterface;
  rubric: RubricInterface;
  currentCompany?: CompanyInterface | null;
  routeBasePath: string;
}

const ProductDetails: React.FC<ProductDetailsInterface> = ({
  product,
  routeBasePath,
  currentCompany,
  rubric,
}) => {
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${product.cardTitle}`,
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
    ],
  };

  return (
    <CmsProductLayout product={product} basePath={routeBasePath} breadcrumbs={breadcrumbs}>
      <ConsoleRubricProductDetails product={product} companySlug={`${currentCompany?.slug}`} />
    </CmsProductLayout>
  );
};

interface ProductPageInterface extends PagePropsInterface, ProductDetailsInterface {}

const Product: NextPage<ProductPageInterface> = ({ pageUrls, ...props }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <ProductDetails {...props} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProductPageInterface>> => {
  const { query } = context;
  const { productId, rubricId } = query;
  const { db } = await getDatabase();
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

  return {
    props: {
      ...props,
      product: castDbData(payload.product),
      rubric: castDbData(payload.rubric),
      currentCompany: castDbData(companyResult),
      routeBasePath: `${ROUTE_CMS}/companies/${companyResult._id}`,
    },
  };
};

export default Product;
