import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

import CompanyRubricProductsList, {
  CompanyRubricProductsListInterface,
} from '../../../../../../components/company/CompanyRubricProductsList';
import RequestError from '../../../../../../components/RequestError';
import { DEFAULT_PAGE_FILTER, ROUTE_CONSOLE } from '../../../../../../config/common';
import { getConsoleCompanyRubricProducts } from '../../../../../../db/dao/product/getConsoleCompanyRubricProducts';
import { AppContentWrapperBreadCrumbs } from '../../../../../../db/uiInterfaces';
import CmsRubricLayout from '../../../../../../layout/cms/CmsRubricLayout';
import ConsoleLayout from '../../../../../../layout/cms/ConsoleLayout';
import { alwaysString } from '../../../../../../lib/arrayUtils';
import {
  castDbData,
  getConsoleInitialData,
  GetConsoleInitialDataPropsInterface,
} from '../../../../../../lib/ssrUtils';
interface RubricProductsConsumerInterface extends CompanyRubricProductsListInterface {}

const RubricProductsConsumer: React.FC<RubricProductsConsumerInterface> = (props) => {
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Товары`,
    config: [
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
  extends GetConsoleInitialDataPropsInterface,
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
  const rubricId = alwaysString(query.rubricId);
  const { props } = await getConsoleInitialData({ context });
  if (!props || !query.companyId) {
    return {
      notFound: true,
    };
  }

  // get company
  const pageCompany = props.layoutProps.pageCompany;
  const companySlug = pageCompany.slug;

  const locale = props.sessionLocale;
  const currency = props.initialData.currency;
  const basePath = `${ROUTE_CONSOLE}/${pageCompany._id}/rubrics/${rubricId}/products/${rubricId}/${DEFAULT_PAGE_FILTER}`;
  const itemPath = `${ROUTE_CONSOLE}/${pageCompany._id}/rubrics/${rubricId}/products/product`;

  const payload = await getConsoleCompanyRubricProducts({
    query: context.query,
    locale,
    basePath,
    currency,
    companySlug,
    companyId: `${pageCompany._id}`,
  });

  const castedPayload = castDbData(payload);

  return {
    props: {
      ...props,
      ...castedPayload,
      itemPath,
      companySlug,
      routeBasePath: `${ROUTE_CONSOLE}/${pageCompany._id}`,
    },
  };
};

export default RubricProducts;
