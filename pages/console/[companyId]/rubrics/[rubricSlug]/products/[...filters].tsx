import { NextPage } from 'next';
import * as React from 'react';

import CompanyRubricProductsList, {
  CompanyRubricProductsListInterface,
} from '../../../../../../components/company/CompanyRubricProductsList';
import RequestError from '../../../../../../components/RequestError';
import { getConsoleRubricProductsListPageSsr } from '../../../../../../db/dao/ssr/getConsoleRubricProductsListPageSsr';
import { AppContentWrapperBreadCrumbs } from '../../../../../../db/uiInterfaces';
import CmsRubricLayout from '../../../../../../layout/cms/CmsRubricLayout';
import ConsoleLayout from '../../../../../../layout/cms/ConsoleLayout';
import { getConsoleCompanyLinks } from '../../../../../../lib/linkUtils';
import { GetConsoleInitialDataPropsInterface } from '../../../../../../lib/ssrUtils';

interface RubricProductsConsumerInterface extends CompanyRubricProductsListInterface {}

const RubricProductsConsumer: React.FC<RubricProductsConsumerInterface> = (props) => {
  const links = getConsoleCompanyLinks({
    companyId: props.pageCompany?._id,
    rubricSlug: props.rubric?.slug,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Товары`,
    config: [
      {
        name: `Рубрикатор`,
        href: links.rubrics.parentLink,
      },
      {
        name: `${props.rubric?.name}`,
        href: links.rubrics.root,
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
      basePath={links.root}
    >
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
