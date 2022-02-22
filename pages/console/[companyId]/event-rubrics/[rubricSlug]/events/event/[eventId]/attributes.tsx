import EventAttributes from 'components/company/EventAttributes';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import EventLayout from 'components/layout/events/EventLayout';
import { getEventAttributesPageSsr } from 'db/ssr/events/getEventAttributesPageSsr';
import {
  AppContentWrapperBreadCrumbs,
  CompanyInterface,
  EventSummaryInterface,
} from 'db/uiInterfaces';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { castDbData, GetAppInitialDataPropsInterface, getConsoleInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

interface EventAttributesPageConsumerInterface {
  pageCompany: CompanyInterface;
  event: EventSummaryInterface;
}

const EventAttributesPageConsumer: React.FC<EventAttributesPageConsumerInterface> = ({
  event,
  pageCompany,
}) => {
  const links = getProjectLinks({
    companyId: pageCompany._id,
    rubricSlug: event.rubricSlug,
    eventId: event._id,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Атрибуты`,
    config: [
      {
        name: `Мероприятия`,
        href: links.console.companyId.events.url,
      },
      {
        name: `${event.rubric?.name}`,
        href: links.console.companyId.events.rubricSlug.url,
      },
      {
        name: `${event.name}`,
        href: links.console.companyId.events.rubricSlug.events.event.eventId.url,
      },
    ],
  };

  return (
    <EventLayout event={event} breadcrumbs={breadcrumbs}>
      <EventAttributes event={event} />
    </EventLayout>
  );
};

export interface EventAttributesPageInterface
  extends GetAppInitialDataPropsInterface,
    EventAttributesPageConsumerInterface {}

const EventAttributesPage: NextPage<EventAttributesPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <EventAttributesPageConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<EventAttributesPageInterface>> => {
  const { query } = context;
  const { props } = await getConsoleInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  // get company
  const company = props.layoutProps.pageCompany;

  const payload = await getEventAttributesPageSsr({
    locale: props.sessionLocale,
    eventId: `${query.eventId}`,
  });

  if (!payload) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...props,
      event: castDbData(payload.summary),
      pageCompany: castDbData(company),
    },
  };
};
export default EventAttributesPage;
