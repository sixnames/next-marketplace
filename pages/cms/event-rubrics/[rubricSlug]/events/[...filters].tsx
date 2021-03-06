import CompanyEvents, { CompanyEventsInterface } from 'components/company/CompanyEvents';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import EventRubricLayout from 'components/layout/events/EventRubricLayout';
import { getRubricEventsListSsr } from 'db/ssr/events/getRubricEventsListSsr';
import { AppContentWrapperBreadCrumbs } from 'db/uiInterfaces';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { NextPage } from 'next';
import * as React from 'react';

interface RubricEventsConsumerInterface extends CompanyEventsInterface {}

const RubricEventsConsumer: React.FC<RubricEventsConsumerInterface> = (props) => {
  const links = getProjectLinks({
    rubricSlug: props.rubric.slug,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Мероприятия`,
    config: [
      {
        name: `Рубрикатор мероприятий`,
        href: links.cms.eventRubrics.url,
      },
      {
        name: `${props.rubric.name}`,
        href: links.cms.companies.companyId.eventRubrics.rubricSlug.url,
      },
    ],
  };

  return (
    <EventRubricLayout rubric={props.rubric} breadcrumbs={breadcrumbs}>
      <CompanyEvents {...props} showControls={false} />
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
