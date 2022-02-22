import CmsCompanyLayout from 'components/layout/cms/CmsCompanyLayout';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import EventRubricsList, { EventRubricsListInterface } from 'components/layout/EventRubricsList';
import { castEventRubricForUI } from 'db/cast/castRubricForUI';
import { COL_EVENT_FACETS } from 'db/collectionNames';
import { getDbCollections } from 'db/mongodb';
import { getCompanySsr } from 'db/ssr/company/getCompanySsr';
import {
  AppContentWrapperBreadCrumbs,
  CompanyInterface,
  EventRubricInterface,
} from 'db/uiInterfaces';
import { getCmsCompanyLinks } from 'lib/linkUtils';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

interface RubricsRouteInterface extends EventRubricsListInterface {
  pageCompany: CompanyInterface;
}

const RubricsRoute: React.FC<RubricsRouteInterface> = ({
  rubrics,
  showDeleteButton,
  showCreateButton,
  pageCompany,
}) => {
  const links = getCmsCompanyLinks({
    companyId: pageCompany._id,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Мероприятия',
    config: [
      {
        name: 'Компании',
        href: links.parentLink,
      },
      {
        name: `${pageCompany?.name}`,
        href: links.root,
      },
    ],
  };

  return (
    <CmsCompanyLayout company={pageCompany} breadcrumbs={breadcrumbs}>
      <EventRubricsList
        rubrics={rubrics}
        showCreateButton={showCreateButton}
        showDeleteButton={showDeleteButton}
      />
    </CmsCompanyLayout>
  );
};

interface RubricsInterface extends GetAppInitialDataPropsInterface, RubricsRouteInterface {}

const Rubrics: NextPage<RubricsInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <RubricsRoute {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<RubricsInterface>> => {
  const collections = await getDbCollections();
  const { query } = context;
  const rubricsCollection = collections.eventRubricsCollection();

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

  // get rubrics
  const initialRubrics = await rubricsCollection
    .aggregate<EventRubricInterface>([
      {
        $match: {
          companyId: company._id,
        },
      },
      {
        $project: {
          attributes: false,
          catalogueTitle: false,
          descriptionI18n: false,
          shortDescriptionI18n: false,
          views: false,
        },
      },
      {
        $lookup: {
          from: COL_EVENT_FACETS,
          as: 'events',
          let: { rubricSlug: '$slug' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$$rubricSlug', '$rubricSlug'],
                },
              },
            },
            {
              $project: {
                _id: true,
              },
            },
            {
              $count: 'totalDocs',
            },
          ],
        },
      },
      {
        $addFields: {
          totalEventsObject: { $arrayElemAt: ['$events', 0] },
        },
      },
      {
        $addFields: {
          eventsCount: '$totalEventsObject.totalDocs',
        },
      },
      {
        $project: {
          variants: false,
          events: false,
          totalEventsObject: false,
        },
      },
    ])
    .toArray();

  const rawRubrics = initialRubrics.map((rubric) => {
    return castEventRubricForUI({ rubric, locale: props.sessionLocale });
  });

  return {
    props: {
      ...props,
      rubrics: castDbData(rawRubrics),
      pageCompany: castDbData(company),
      showDeleteButton: false,
      showCreateButton: false,
    },
  };
};

export default Rubrics;
