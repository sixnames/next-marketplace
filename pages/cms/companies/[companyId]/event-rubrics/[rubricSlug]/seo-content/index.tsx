import ConsoleSeoContentsList, {
  ConsoleSeoContentsListInterface,
} from 'components/console/ConsoleSeoContentsList';
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
import { PAGE_EDITOR_DEFAULT_VALUE_STRING } from 'lib/config/common';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

interface EventRubricSeoContentsListConsumerInterface
  extends EventRubricLayoutInterface,
    ConsoleSeoContentsListInterface {}

const EventRubricSeoContentsListConsumer: React.FC<EventRubricSeoContentsListConsumerInterface> = ({
  rubric,
  pageCompany,
  seoContents,
}) => {
  const links = getProjectLinks({
    companyId: pageCompany._id,
    rubricSlug: rubric.slug,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `SEO тексты`,
    config: [
      {
        name: 'Компании',
        href: links.cms.companies.url,
      },
      {
        name: `${pageCompany?.name}`,
        href: links.cms.companies.companyId.url,
      },
      {
        name: `Мероприятия`,
        href: links.cms.companies.companyId.eventRubrics.url,
      },
      {
        name: `${rubric.name}`,
        href: links.cms.companies.companyId.eventRubrics.rubricSlug.attributes.url,
      },
    ],
  };

  return (
    <EventRubricLayout pageCompany={pageCompany} rubric={rubric} breadcrumbs={breadcrumbs}>
      <Inner>
        <ConsoleSeoContentsList seoContents={seoContents} />
      </Inner>
    </EventRubricLayout>
  );
};

interface EventRubricSeoContentsListPageInterface
  extends GetAppInitialDataPropsInterface,
    EventRubricSeoContentsListConsumerInterface {}

const EventRubricSeoContentsListPage: NextPage<EventRubricSeoContentsListPageInterface> = ({
  layoutProps,
  ...props
}) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <EventRubricSeoContentsListConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<EventRubricSeoContentsListPageInterface>> => {
  const { query } = context;
  const collections = await getDbCollections();
  const rubricsCollection = collections.eventRubricsCollection();
  const seoContentsCollection = collections.seoContentsCollection();
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

  const seoContents = await seoContentsCollection
    .find({
      rubricSlug: rubric.slug,
      content: {
        $ne: PAGE_EDITOR_DEFAULT_VALUE_STRING,
      },
    })
    .toArray();

  return {
    props: {
      ...props,
      seoContents: castDbData(seoContents),
      rubric: castDbData(rubric),
      pageCompany: castDbData(company),
    },
  };
};

export default EventRubricSeoContentsListPage;
