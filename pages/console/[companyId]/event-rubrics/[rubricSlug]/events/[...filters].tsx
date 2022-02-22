import CompanyEvents, { CompanyEventsInterface } from 'components/company/CompanyEvents';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import EventRubricLayout from 'components/layout/events/EventRubricLayout';
import { getConsoleRubricEventsListSsr } from 'db/ssr/events/getConsoleRubricEventsListSsr';
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
        name: `Рубрикатор мероприятий`,
        href: links.console.companyId.eventRubrics.url,
      },
      {
        name: `${props.rubric.name}`,
        href: links.console.companyId.eventRubrics.rubricSlug.url,
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

export const getServerSideProps = getConsoleRubricEventsListSsr;
export default CmsRubricEventsPage;
