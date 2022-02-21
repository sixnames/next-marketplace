import EventDetails from 'components/company/EventDetails';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import EventLayout from 'components/layout/events/EventLayout';
import { getCompanySsr } from 'db/ssr/company/getCompanySsr';
import { getEventFullSummary } from 'db/ssr/events/getEventFullSummary';
import {
  AppContentWrapperBreadCrumbs,
  CompanyInterface,
  EventSummaryInterface,
} from 'db/uiInterfaces';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

interface EventDetailsConsumerInterface {
  pageCompany: CompanyInterface;
  event: EventSummaryInterface;
}

const EventDetailsConsumer: React.FC<EventDetailsConsumerInterface> = ({ event, pageCompany }) => {
  const links = getProjectLinks({
    companyId: pageCompany._id,
    rubricSlug: event.rubricSlug,
    eventId: event._id,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${event.name}`,
    config: [
      {
        name: 'Компании',
        href: links.cms.companies.url,
      },
      {
        name: `${pageCompany.name}`,
        href: links.cms.companies.companyId.url,
      },
      {
        name: `Мероприятия`,
        href: links.cms.companies.companyId.events.url,
      },
      {
        name: `${event.rubric?.name}`,
        href: links.cms.companies.companyId.events.rubricSlug.url,
      },
    ],
  };

  return (
    <EventLayout event={event} breadcrumbs={breadcrumbs}>
      <EventDetails event={event} />
    </EventLayout>
  );
};

interface EventDetailsPageInterface
  extends GetAppInitialDataPropsInterface,
    EventDetailsConsumerInterface {}

const EventDetailsPage: NextPage<EventDetailsPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <EventDetailsConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<EventDetailsPageInterface>> => {
  const { query } = context;
  const { props } = await getAppInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  // get company
  const company = await getCompanySsr({
    companyId: `${query.companyId}`,
  });
  if (!company) {
    return {
      notFound: true,
    };
  }

  const payload = await getEventFullSummary({
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

export default EventDetailsPage;
