import CompanyRubricProductsList, {
  CompanyRubricProductsListInterface,
} from 'components/company/CompanyRubricProductsList';
import CmsRubricLayout from 'components/layout/cms/CmsRubricLayout';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import RequestError from 'components/RequestError';
import { getCmsCompanyRubricProductsPageSsr } from 'db/ssr/company/getCmsCompanyRubricProductsPageSsr';
import { AppContentWrapperBreadCrumbs } from 'db/uiInterfaces';
import { getProjectLinks } from 'lib/links/getProjectLinks';

import { GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { NextPage } from 'next';
import * as React from 'react';

interface RubricProductsConsumerInterface extends CompanyRubricProductsListInterface {}

const RubricProductsConsumer: React.FC<RubricProductsConsumerInterface> = (props) => {
  const links = getProjectLinks({
    companyId: props.pageCompany._id,
    rubricSlug: props.rubric?.slug,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Товары`,
    config: [
      {
        name: 'Компании',
        href: links.cms.companies.url,
      },
      {
        name: `${props.pageCompany?.name}`,
        href: links.cms.companies.companyId.url,
      },
      {
        name: `Рубрикатор`,
        href: links.cms.companies.companyId.rubrics.url,
      },
      {
        name: `${props.rubric?.name}`,
        href: links.cms.companies.companyId.rubrics.rubricSlug.url,
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

export interface CmsCompanyRubricProductsPageInterface
  extends GetAppInitialDataPropsInterface,
    RubricProductsConsumerInterface {}

const CmsCompanyRubricProductsPage: NextPage<CmsCompanyRubricProductsPageInterface> = ({
  layoutProps,
  ...props
}) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <RubricProductsConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = getCmsCompanyRubricProductsPageSsr;
export default CmsCompanyRubricProductsPage;
