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
import { getConsoleRubricLinks } from '../../../../../../lib/linkUtils';
import { GetConsoleInitialDataPropsInterface } from '../../../../../../lib/ssrUtils';

interface RubricProductsConsumerInterface extends CompanyRubricProductsListInterface {}

const RubricProductsConsumer: React.FC<RubricProductsConsumerInterface> = (props) => {
  const links = getConsoleRubricLinks({
    rubricSlug: props.rubric?.slug,
    basePath: props.routeBasePath,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Товары`,
    config: [
      {
        name: `Рубрикатор`,
        href: links.parentLink,
      },
      {
        name: `${props.rubric?.name}`,
        href: links.root,
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

export interface ConsoleRubricProductsListPageInterface
  extends GetConsoleInitialDataPropsInterface,
    RubricProductsConsumerInterface {}

const ConsoleRubricProductsListPage: NextPage<ConsoleRubricProductsListPageInterface> = ({
  layoutProps,
  ...props
}) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <RubricProductsConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = getConsoleRubricProductsListPageSsr;
export default ConsoleRubricProductsListPage;
