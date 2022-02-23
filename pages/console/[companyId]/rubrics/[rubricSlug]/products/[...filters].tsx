import CompanyRubricProductsList, {
  CompanyRubricProductsListInterface,
} from 'components/company/CompanyRubricProductsList';
import CmsRubricLayout from 'components/layout/cms/CmsRubricLayout';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import RequestError from 'components/RequestError';
import { getConsoleRubricProductsListPageSsr } from 'db/ssr/rubrics/getConsoleRubricProductsListPageSsr';
import { AppContentWrapperBreadCrumbs } from 'db/uiInterfaces';
import { getProjectLinks } from 'lib/links/getProjectLinks';

import { GetConsoleInitialDataPropsInterface } from 'lib/ssrUtils';
import { NextPage } from 'next';
import * as React from 'react';

interface RubricProductsConsumerInterface extends CompanyRubricProductsListInterface {}

const RubricProductsConsumer: React.FC<RubricProductsConsumerInterface> = (props) => {
  const links = getProjectLinks({
    companyId: props.pageCompany?._id,
    rubricSlug: props.rubric?.slug,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Товары`,
    config: [
      {
        name: `Рубрикатор`,
        href: links.console.companyId.rubrics.url,
      },
      {
        name: `${props.rubric?.name}`,
        href: links.console.companyId.rubrics.rubricSlug.url,
      },
    ],
  };

  if (!props.rubric) {
    return <RequestError />;
  }

  return (
    <CmsRubricLayout hideAttributesPath rubric={props.rubric} breadcrumbs={breadcrumbs}>
      <CompanyRubricProductsList {...props} />
    </CmsRubricLayout>
  );
};

export interface ConsoleRubricProductsListPageInterface
  extends GetConsoleInitialDataPropsInterface,
    RubricProductsConsumerInterface {}

const ConsoleRubricProductsListPage: NextPage<ConsoleRubricProductsListPageInterface> = ({
  layoutProps,
  ...props
}) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <RubricProductsConsumer {...props} pageCompany={layoutProps.pageCompany} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = getConsoleRubricProductsListPageSsr;
export default ConsoleRubricProductsListPage;
