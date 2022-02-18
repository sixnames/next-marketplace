import EventAssets from 'components/company/EventAssets';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import EventLayout from 'components/layout/events/EventLayout';
import { getCompanySsr } from 'db/ssr/company/getCompanySsr';
import { getEventAttributesPageSsr } from 'db/ssr/events/getEventAttributesPageSsr';
import {
  AppContentWrapperBreadCrumbs,
  CompanyInterface,
  EventSummaryInterface,
} from 'db/uiInterfaces';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
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
      {
        name: `${event.name}`,
        href: links.cms.companies.companyId.events.rubricSlug.events.event.eventId.url,
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
