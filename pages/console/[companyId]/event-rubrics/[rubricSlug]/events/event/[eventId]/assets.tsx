import EventAssets from 'components/company/EventAssets';
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

interface EventAssetsConsumerInterface {
  pageCompany: CompanyInterface;
  event: EventSummaryInterface;
}

const EventAssetsConsumer: React.FC<EventAssetsConsumerInterface> = ({ event, pageCompany }) => {
  const links = getProjectLinks({
    companyId: pageCompany._id,
    rubricSlug: event.rubricSlug,
    eventId: event._id,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Изображения`,
    config: [
      {
        name: `Рубрикатор мероприятий`,
        href: links.console.companyId.eventRubrics.url,
      },
      {
        name: `${event.rubric?.name}`,
        href: links.console.companyId.eventRubrics.rubricSlug.url,
      },
      {
        name: `${event.name}`,
        href: links.console.companyId.eventRubrics.rubricSlug.events.event.eventId.url,
      },
    ],
  };

  return (
    <EventLayout event={event} breadcrumbs={breadcrumbs}>
      <EventAssets summary={event} />
    </EventLayout>
  );
};

interface EventAssetsPageInterface
  extends GetAppInitialDataPropsInterface,
    EventAssetsConsumerInterface {}

const EventAssetsPage: NextPage<EventAssetsPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <EventAssetsConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<EventAssetsPageInterface>> => {
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

export default EventAssetsPage;
