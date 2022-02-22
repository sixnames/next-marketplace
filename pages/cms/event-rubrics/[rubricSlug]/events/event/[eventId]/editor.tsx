import EventEditor from 'components/company/EventEditor';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import EventLayout from 'components/layout/events/EventLayout';
import { getCompanySsr } from 'db/ssr/company/getCompanySsr';
import { getEventFullSummary } from 'db/ssr/events/getEventFullSummary';
import {
  AppContentWrapperBreadCrumbs,
  CompanyInterface,
  EventSummaryInterface,
  SeoContentInterface,
} from 'db/uiInterfaces';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

interface EventAttributesInterface {
  event: EventSummaryInterface;
  cardContent: SeoContentInterface;
  pageCompany: CompanyInterface;
}

const EventAttributes: React.FC<EventAttributesInterface> = ({
  event,
  cardContent,
  pageCompany,
}) => {
  const links = getProjectLinks({
    companyId: pageCompany._id,
    rubricSlug: event.rubricSlug,
    eventId: event._id,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Контент карточки`,
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
        href: links.cms.companies.companyId.eventRubrics.url,
      },
      {
        name: `${event.rubric?.name}`,
        href: links.cms.companies.companyId.eventRubrics.rubricSlug.url,
      },
      {
        name: `${event.name}`,
        href: links.cms.companies.companyId.eventRubrics.rubricSlug.events.event.eventId.url,
      },
    ],
  };

  return (
    <EventLayout event={event} breadcrumbs={breadcrumbs}>
      <EventEditor cardContent={cardContent} event={event} />
    </EventLayout>
  );
};

interface EventPageInterface extends GetAppInitialDataPropsInterface, EventAttributesInterface {}

const Event: NextPage<EventPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <EventAttributes {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<EventPageInterface>> => {
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

  if (!payload || !payload.cardContent) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...props,
      event: castDbData(payload.summary),
      pageCompany: castDbData(company),
      cardContent: castDbData(payload.cardContent),
    },
  };
};

export default Event;
