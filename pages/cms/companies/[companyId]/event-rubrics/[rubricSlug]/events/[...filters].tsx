import CompanyEvents, { CompanyEventsInterface } from 'components/company/CompanyEvents';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import EventRubricLayout from 'components/layout/events/EventRubricLayout';
import { getRubricEventsListSsr } from 'db/ssr/events/getRubricEventsListSsr';
import { AppContentWrapperBreadCrumbs, CompanyInterface } from 'db/uiInterfaces';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { NextPage } from 'next';
import * as React from 'react';

interface RubricEventsConsumerInterface extends CompanyEventsInterface {
  pageCompany: CompanyInterface;
}

const RubricEventsConsumer: React.FC<RubricEventsConsumerInterface> = (props) => {
  const links = getProjectLinks({
    companyId: props.pageCompany._id,
    rubricSlug: props.rubric.slug,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Мероприятия`,
    config: [
      {
        name: 'Компании',
        href: links.cms.companies.url,
      },
      {
        name: `${props.pageCompany.name}`,
        href: links.cms.companies.companyId.url,
      },
      {
        name: `Рубрикатор мероприятий`,
        href: links.cms.companies.companyId.eventRubrics.url,
      },
      {
        name: `${props.rubric.name}`,
        href: links.cms.companies.companyId.eventRubrics.rubricSlug.url,
      },
    ],
  };

  return (
    <EventRubricLayout
      hideAttributesLink
      hideDetailsLink
      rubric={props.rubric}
      breadcrumbs={breadcrumbs}
    >
      <CompanyEvents {...props} showControls={true} />
    </EventRubricLayout>
  );
};

export interface CmsRubricEventsPageInterface
  extends GetAppInitialDataPropsInterface,
    RubricEventsConsumerInterface {}

const CmsRubricEventsPage: NextPage<CmsRubricEventsPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <RubricEventsConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = getRubricEventsListSsr;
export default CmsRubricEventsPage;
