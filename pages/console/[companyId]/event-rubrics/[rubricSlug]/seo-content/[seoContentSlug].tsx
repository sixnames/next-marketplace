import ConsoleSeoContentDetails, {
  ConsoleSeoContentDetailsInterface,
} from 'components/console/ConsoleSeoContentDetails';
import Inner from 'components/Inner';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import EventRubricLayout, {
  EventRubricLayoutInterface,
} from 'components/layout/events/EventRubricLayout';
import { castEventRubricForUI } from 'db/cast/castRubricForUI';
import { getDbCollections } from 'db/mongodb';
import { AppContentWrapperBreadCrumbs, EventRubricInterface } from 'db/uiInterfaces';
import { rubricAttributeGroupsPipeline } from 'db/utils/constantPipelines';
import { alwaysString } from 'lib/arrayUtils';
import { CATALOGUE_SEO_TEXT_POSITION_TOP } from 'lib/config/common';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { getSeoContentBySlug } from 'lib/seoContentUtils';
import { castDbData, GetAppInitialDataPropsInterface, getConsoleInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

interface EventRubricSeoContentConsumerInterface
  extends EventRubricLayoutInterface,
    ConsoleSeoContentDetailsInterface {}

const EventRubricSeoContentConsumer: React.FC<EventRubricSeoContentConsumerInterface> = ({
  rubric,
  seoContent,
  companySlug,
  showSeoFields,
  pageCompany,
}) => {
  const links = getProjectLinks({
    companyId: pageCompany._id,
    rubricSlug: rubric.slug,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `SEO тексты`,
    config: [
      {
        name: `Мероприятия`,
        href: links.console.companyId.eventRubrics.url,
      },
      {
        name: `${rubric.name}`,
        href: links.console.companyId.eventRubrics.rubricSlug.attributes.url,
      },
    ],
  };

  return (
    <EventRubricLayout pageCompany={pageCompany} rubric={rubric} breadcrumbs={breadcrumbs}>
      <Inner>
        <ConsoleSeoContentDetails
          seoContent={seoContent}
          companySlug={companySlug}
          showSeoFields={showSeoFields}
        />
      </Inner>
    </EventRubricLayout>
  );
};

interface EventRubricSeoContentPageInterface
  extends GetAppInitialDataPropsInterface,
    EventRubricSeoContentConsumerInterface {}

const EventRubricSeoContentPage: NextPage<EventRubricSeoContentPageInterface> = ({
  layoutProps,
  ...props
}) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <EventRubricSeoContentConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<EventRubricSeoContentPageInterface>> => {
  const collections = await getDbCollections();
  const rubricsCollection = collections.eventRubricsCollection();
  const { query } = context;
  const { props } = await getConsoleInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  // get company
  const company = props.layoutProps.pageCompany;

  const url = alwaysString(query.url);
  const seoContentSlug = alwaysString(query.seoContentSlug);

  const initialRubrics = await rubricsCollection
    .aggregate<EventRubricInterface>([
      {
        $match: {
          slug: `${query.rubricSlug}`,
        },
      },
      // get attributes
      ...rubricAttributeGroupsPipeline,
    ])
    .toArray();
  const initialRubric = initialRubrics[0];
  if (!initialRubric) {
    return {
      notFound: true,
    };
  }

  const rubric = castEventRubricForUI({
    rubric: initialRubric,
    locale: props.sessionLocale,
  });

  const seoContent = await getSeoContentBySlug({
    url,
    seoContentSlug,
    companySlug: company.slug,
    rubricSlug: rubric.slug,
  });
  if (!seoContent) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...props,
      rubric: castDbData(rubric),
      seoContent: castDbData(seoContent),
      pageCompany: castDbData(company),
      showSeoFields: seoContentSlug.indexOf(CATALOGUE_SEO_TEXT_POSITION_TOP) > -1,
      companySlug: company.slug,
    },
  };
};

export default EventRubricSeoContentPage;
