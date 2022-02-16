import ConsoleRubricProductAttributes from 'components/console/ConsoleRubricProductAttributes';
import CmsProductLayout from 'components/layout/cms/CmsProductLayout';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import { getDbCollections } from 'db/mongodb';
import { getCmsProductAttributesPageSsr } from 'db/ssr/products/getCmsProductAttributesPageSsr';
import {
  AppContentWrapperBreadCrumbs,
  CompanyInterface,
  ProductSummaryInterface,
} from 'db/uiInterfaces';
import { getCmsCompanyLinks } from 'lib/linkUtils';
import { castDbData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

interface CmsProductAttributesPageConsumerInterface {
  product: ProductSummaryInterface;
  pageCompany: CompanyInterface;
}

const CmsProductAttributesPageConsumer: React.FC<CmsProductAttributesPageConsumerInterface> = ({
  product,
  pageCompany,
}) => {
  const links = getCmsCompanyLinks({
    companyId: pageCompany._id,
    rubricSlug: product.rubricSlug,
    productId: product._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Атрибуты`,
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
      basePath={links.root}
    >
      <ConsoleRubricProductAttributes product={product} />
    </CmsProductLayout>
  );
};

interface CmsProductAttributesPageInterface
  extends GetAppInitialDataPropsInterface,
    CmsProductAttributesPageConsumerInterface {}

const CmsProductAttributesPage: NextPage<CmsProductAttributesPageInterface> = ({
  layoutProps,
  ...props
}) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <CmsProductAttributesPageConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CmsProductAttributesPageInterface>> => {
  const props = await getCmsProductAttributesPageSsr(context);
  if (!props) {
    return {
      notFound: true,
    };
  }

  // get company
  const collections = await getDbCollections();
  const companiesCollection = collections.companiesCollection();
  const companyId = new ObjectId(`${context.query.companyId}`);
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

  return {
    props: {
      ...props,
      pageCompany: castDbData(companyResult),
    },
  };
};

export default CmsProductAttributesPage;
