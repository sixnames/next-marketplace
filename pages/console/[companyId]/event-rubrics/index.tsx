import Inner from 'components/Inner';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import EventRubricsList, { EventRubricsListInterface } from 'components/layout/EventRubricsList';
import WpTitle from 'components/WpTitle';
import { castEventRubricForUI } from 'db/cast/castRubricForUI';
import { COL_EVENT_FACETS } from 'db/collectionNames';
import { getDbCollections } from 'db/mongodb';
import { EventRubricInterface } from 'db/uiInterfaces';
import { castDbData, GetAppInitialDataPropsInterface, getConsoleInitialData } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

interface RubricsRouteInterface extends EventRubricsListInterface {}

const pageTitle = 'Рубрикатор мероприятий';

const RubricsRoute: React.FC<RubricsRouteInterface> = ({
  rubrics,
  showCreateButton,
  showDeleteButton,
}) => {
  return (
    <AppContentWrapper>
      <Inner lowBottom>
        <WpTitle>{pageTitle}</WpTitle>
        <EventRubricsList
          rubrics={rubrics}
          showCreateButton={showCreateButton}
          showDeleteButton={showDeleteButton}
        />
      </Inner>
    </AppContentWrapper>
  );
};

interface RubricsInterface extends GetAppInitialDataPropsInterface, RubricsRouteInterface {}

const Rubrics: NextPage<RubricsInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps} title={pageTitle}>
      <RubricsRoute {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<RubricsInterface>> => {
  const collections = await getDbCollections();
  const rubricsCollection = collections.eventRubricsCollection();
  const { props } = await getConsoleInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  // get rubrics
  const initialRubrics = await rubricsCollection
    .aggregate<EventRubricInterface>([
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
                companyId: new ObjectId(props.layoutProps.pageCompany._id),
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
      showDeleteButton: false,
      showCreateButton: false,
    },
  };
};

export default Rubrics;
