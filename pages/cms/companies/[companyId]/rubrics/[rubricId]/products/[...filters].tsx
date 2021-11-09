import CompanyRubricProductsList, {
  CompanyRubricProductsListInterface,
} from 'components/company/CompanyRubricProductsList';
import RequestError from 'components/RequestError';
import { ROUTE_CMS, DEFAULT_PAGE_FILTER } from 'config/common';
import { COL_COMPANIES } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { CompanyInterface } from 'db/uiInterfaces';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsRubricLayout from 'layout/cms/CmsRubricLayout';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import { alwaysString } from 'lib/arrayUtils';
import { getConsoleCompanyRubricProducts } from 'lib/consoleProductUtils';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

interface RubricProductsConsumerInterface extends CompanyRubricProductsListInterface {}

const RubricProductsConsumer: React.FC<RubricProductsConsumerInterface> = (props) => {
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Товары`,
    config: [
      {
        name: 'Компании',
        href: `${ROUTE_CMS}/companies`,
      },
      {
        name: `${props.currentCompany?.name}`,
        href: props.routeBasePath,
      },
      {
        name: `Рубрикатор`,
        href: `${props.routeBasePath}/rubrics`,
      },
      {
        name: `${props.rubric?.name}`,
        href: `${props.routeBasePath}/rubrics/${props.rubric?._id}`,
      },
    ],
  };

  if (!props.rubric) {
    return <RequestError />;
  }

  return (
    <CmsRubricLayout
      hideAttributesPath
      rubric={props.rubric}
      breadcrumbs={breadcrumbs}
      basePath={props.routeBasePath}
    >
      <CompanyRubricProductsList {...props} />
    </CmsRubricLayout>
  );
};

interface RubricProductsPageInterface
  extends GetAppInitialDataPropsInterface,
    RubricProductsConsumerInterface {}

const RubricProducts: NextPage<RubricProductsPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <RubricProductsConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<RubricProductsPageInterface>> => {
  const { query } = context;
  const { db } = await getDatabase();
  const companiesCollection = db.collection<CompanyInterface>(COL_COMPANIES);
  const rubricId = alwaysString(query.rubricId);
  const initialProps = await getAppInitialData({ context });
  if (!initialProps.props || !query.companyId) {
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

  const locale = initialProps.props.sessionLocale;
  const currency = initialProps.props.initialData.currency;
  const basePath = `${ROUTE_CMS}/companies/${companyResult._id}/rubrics/${rubricId}/products/${rubricId}/${DEFAULT_PAGE_FILTER}`;
  const itemPath = `${ROUTE_CMS}/companies/${companyResult._id}/rubrics/${rubricId}/products/product`;

  const payload = await getConsoleCompanyRubricProducts({
    query: context.query,
    locale,
    basePath,
    currency,
    companySlug,
    companyId: `${companyResult._id}`,
  });

  const castedPayload = castDbData(payload);

  return {
    props: {
      ...initialProps.props,
      ...castedPayload,
      itemPath,
      companySlug,
      pageCompany: castDbData(companyResult),
      routeBasePath: `${ROUTE_CMS}/companies/${companyResult._id}`,
    },
  };
};

export default RubricProducts;
