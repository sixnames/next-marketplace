import EventRubricDetails, {
  EventRubricDetailsInterface,
} from 'components/company/EventRubricDetails';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import EventRubricLayout, {
  EventRubricLayoutInterface,
} from 'components/layout/events/EventRubricLayout';
import { castEventRubricForUI } from 'db/cast/castRubricForUI';
import { getDbCollections } from 'db/mongodb';
import { AppContentWrapperBreadCrumbs, EventRubricInterface } from 'db/uiInterfaces';
import {
  CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
  CATALOGUE_SEO_TEXT_POSITION_TOP,
  DEFAULT_COMPANY_SLUG,
} from 'lib/config/common';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { getEventRubricAllSeoContents } from 'lib/seoContentUtils';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

interface RubricDetailsInterface extends EventRubricDetailsInterface, EventRubricLayoutInterface {}

const RubricDetails: React.FC<RubricDetailsInterface> = ({ rubric, textBottom, textTop }) => {
  const links = getProjectLinks();
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${rubric.name}`,
    config: [
      {
        name: `Рубрикатор мероприятий`,
        href: links.cms.eventRubrics.url,
      },
    ],
  };

  return (
    <EventRubricLayout rubric={rubric} breadcrumbs={breadcrumbs}>
      <EventRubricDetails rubric={rubric} textBottom={textBottom} textTop={textTop} />
    </EventRubricLayout>
  );
};

interface RubricPageInterface extends GetAppInitialDataPropsInterface, RubricDetailsInterface {}

const RubricPage: NextPage<RubricPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <RubricDetails {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<RubricPageInterface>> => {
  const { query } = context;
  const collections = await getDbCollections();
  const rubricsCollection = collections.eventRubricsCollection();

  const { props } = await getAppInitialData({ context });
  if (!props) {
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

  const seoDescriptionTop = await getEventRubricAllSeoContents({
    rubricSlug: rubric.slug,
    rubricId: rubric._id,
    companySlug: DEFAULT_COMPANY_SLUG,
    position: CATALOGUE_SEO_TEXT_POSITION_TOP,
    locale: props.sessionLocale,
  });

  const seoDescriptionBottom = await getEventRubricAllSeoContents({
    rubricSlug: rubric.slug,
    rubricId: rubric._id,
    companySlug: DEFAULT_COMPANY_SLUG,
    position: CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
    locale: props.sessionLocale,
  });

  if (!seoDescriptionBottom || !seoDescriptionTop) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...props,
      textBottom: castDbData(seoDescriptionBottom),
      textTop: castDbData(seoDescriptionTop),
      rubric: castDbData(rubric),
    },
  };
};

export default RubricPage;
