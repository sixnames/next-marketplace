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
import { getCompanySsr } from 'db/ssr/company/getCompanySsr';
import { AppContentWrapperBreadCrumbs, EventRubricInterface } from 'db/uiInterfaces';
import { rubricAttributeGroupsPipeline } from 'db/utils/constantPipelines';
import { alwaysString } from 'lib/arrayUtils';
import { CATALOGUE_SEO_TEXT_POSITION_TOP, DEFAULT_COMPANY_SLUG } from 'lib/config/common';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { getSeoContentBySlug } from 'lib/seoContentUtils';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
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
}) => {
  const links = getProjectLinks({
    rubricSlug: rubric.slug,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `SEO тексты`,
    config: [
      {
        name: `Рубрикатор мероприятий`,
        href: links.cms.eventRubrics.url,
      },
      {
        name: `${rubric.name}`,
        href: links.cms.companies.companyId.eventRubrics.rubricSlug.url,
      },
    ],
  };

  return (
    <EventRubricLayout rubric={rubric} breadcrumbs={breadcrumbs}>
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
  const { query } = context;
  const { props } = await getAppInitialData({ context });
  const collections = await getDbCollections();
  const rubricsCollection = collections.eventRubricsCollection();
  if (!props) {
    return {
      notFound: true,
    };
  }

  const url = alwaysString(query.url);
  const seoContentSlug = alwaysString(query.seoContentSlug);

  // get company
  const company = await getCompanySsr({
    companyId: `${query.companyId}`,
  });
  if (!company) {
    return {
      notFound: true,
    };
  }

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

  const companySlug = DEFAULT_COMPANY_SLUG;
  const seoContent = await getSeoContentBySlug({
    url,
    seoContentSlug,
    companySlug,
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
      showSeoFields: seoContentSlug.indexOf(CATALOGUE_SEO_TEXT_POSITION_TOP) > -1,
      companySlug,
    },
  };
};

export default EventRubricSeoContentPage;
