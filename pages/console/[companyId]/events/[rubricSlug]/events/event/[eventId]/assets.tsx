import { DEFAULT_COMPANY_SLUG } from 'lib/config/common';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';
import ConsoleRubricProductAssets from 'components/console/ConsoleRubricProductAssets';
import { COL_COMPANIES } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  CompanyInterface,
  ProductSummaryInterface,
} from 'db/uiInterfaces';
import CmsProductLayout from 'components/layout/cms/CmsProductLayout';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import { getCmsCompanyLinks } from 'lib/linkUtils';
import { getFullProductSummaryWithDraft } from 'lib/productUtils';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';

interface ProductAssetsInterface {
  product: ProductSummaryInterface;
  pageCompany: CompanyInterface;
  routeBasePath: string;
}

const ProductAssets: React.FC<ProductAssetsInterface> = ({
  product,
  pageCompany,
  routeBasePath,
}) => {
  const links = getCmsCompanyLinks({
    companyId: pageCompany._id,
    rubricSlug: product.rubricSlug,
    productId: product._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Изображения`,
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
        href: links.rubrics.product.parentLink,
      },
      {
        name: `${product.snippetTitle}`,
        href: links.rubrics.product.root,
      },
    ],
  };

  return (
    <CmsProductLayout
      companySlug={pageCompany.slug}
      product={product}
      breadcrumbs={breadcrumbs}
      basePath={routeBasePath}
    >
      <ConsoleRubricProductAssets summary={product} />
    </CmsProductLayout>
  );
};

interface ProductPageInterface extends GetAppInitialDataPropsInterface, ProductAssetsInterface {}

const Product: NextPage<ProductPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <ProductAssets {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProductPageInterface>> => {
  const { query } = context;
  const { productId } = query;
  const { db } = await getDatabase();
  const companiesCollection = db.collection<CompanyInterface>(COL_COMPANIES);
  const { props } = await getAppInitialData({ context });
  if (!props) {
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

  const payload = await getFullProductSummaryWithDraft({
    locale: props.sessionLocale,
    productId: `${productId}`,
    companySlug: DEFAULT_COMPANY_SLUG,
    isContentManager: Boolean(props.layoutProps.sessionUser.me.role?.isContentManager),
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
      product: castDbData(payload.summary),
      pageCompany: castDbData(companyResult),
      routeBasePath: links.root,
    },
  };
};

export default Product;
