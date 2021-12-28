import { ObjectId } from 'mongodb';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import ConsoleRubricProductDetails from '../../../../../../../../../components/console/ConsoleRubricProductDetails';
import { COL_COMPANIES } from '../../../../../../../../../db/collectionNames';
import { getDatabase } from '../../../../../../../../../db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  CompanyInterface,
  ProductSummaryInterface,
} from '../../../../../../../../../db/uiInterfaces';
import CmsProductLayout from '../../../../../../../../../layout/cms/CmsProductLayout';
import { getCmsCompanyLinks } from '../../../../../../../../../lib/linkUtils';
import { getCmsProduct } from '../../../../../../../../../lib/productUtils';
import {
  castDbData,
  getAppInitialData,
  GetAppInitialDataPropsInterface,
} from '../../../../../../../../../lib/ssrUtils';
import ConsoleLayout from '../../../../../../../../../layout/cms/ConsoleLayout';

interface ProductDetailsInterface {
  product: ProductSummaryInterface;
  pageCompany: CompanyInterface;
  routeBasePath: string;
}

const ProductDetails: React.FC<ProductDetailsInterface> = ({
  product,
  routeBasePath,
  pageCompany,
}) => {
  const links = getCmsCompanyLinks({
    companyId: pageCompany._id,
    rubricSlug: product.rubricSlug,
    productId: product._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${product.cardTitle}`,
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
        name: `Рубрикатор`,
        href: links.rubrics.parentLink,
      },
      {
        name: `${product.rubric?.name}`,
        href: links.rubrics.root,
      },
      {
        name: `Товары`,
        href: links.rubrics.products,
      },
    ],
  };

  return (
    <CmsProductLayout
      companySlug={pageCompany.slug}
      product={product}
      basePath={routeBasePath}
      breadcrumbs={breadcrumbs}
    >
      <ConsoleRubricProductDetails product={product} companySlug={`${pageCompany?.slug}`} />
    </CmsProductLayout>
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

  const links = getCmsCompanyLinks({
    companyId: companyResult._id,
  });

  return {
    props: {
      ...props,
      product: castDbData(payload.product),
      pageCompany: castDbData(companyResult),
      routeBasePath: links.root,
    },
  };
};

export default Product;
