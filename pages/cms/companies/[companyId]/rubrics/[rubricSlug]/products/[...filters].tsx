import { NextPage } from 'next';
import * as React from 'react';
import CompanyRubricProductsList, {
  CompanyRubricProductsListInterface,
} from '../../../../../../../components/company/CompanyRubricProductsList';
import RequestError from '../../../../../../../components/RequestError';
import { getCmsCompanyRubricProductsPageSsr } from '../../../../../../../db/dao/ssr/getCmsCompanyRubricProductsPageSsr';
import { AppContentWrapperBreadCrumbs } from '../../../../../../../db/uiInterfaces';
import CmsRubricLayout from '../../../../../../../layout/cms/CmsRubricLayout';
import ConsoleLayout from '../../../../../../../layout/cms/ConsoleLayout';
import { getCmsCompanyLinks } from '../../../../../../../lib/linkUtils';
import { GetAppInitialDataPropsInterface } from '../../../../../../../lib/ssrUtils';

interface RubricProductsConsumerInterface extends CompanyRubricProductsListInterface {}

const RubricProductsConsumer: React.FC<RubricProductsConsumerInterface> = (props) => {
  const links = getCmsCompanyLinks({
    companyId: props.pageCompany._id,
    rubricSlug: props.rubric?.slug,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Товары`,
    config: [
      {
        name: 'Компании',
        href: links.parentLink,
      },
      {
        name: `${props.pageCompany?.name}`,
        href: links.root,
      },
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
      basePath={props.routeBasePath}
    >
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
