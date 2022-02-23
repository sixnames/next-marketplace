import CreateEvent, { CreateEventInterface } from 'components/company/CreateEvent';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import EventRubricLayout from 'components/layout/events/EventRubricLayout';
import { castEventRubricForUI } from 'db/cast/castRubricForUI';
import { getDbCollections } from 'db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  CompanyInterface,
  EventRubricInterface,
} from 'db/uiInterfaces';
import { rubricAttributeGroupsPipeline } from 'db/utils/constantPipelines';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { castDbData, GetAppInitialDataPropsInterface, getConsoleInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

interface CreateEventConsumerInterface extends CreateEventInterface {
  pageCompany: CompanyInterface;
}

const CreateEventConsumer: React.FC<CreateEventConsumerInterface> = ({ rubric, pageCompany }) => {
  const links = getProjectLinks({
    companyId: pageCompany._id,
    rubricSlug: rubric.slug,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Создание мероприятия`,
    config: [
      {
        name: `Рубрикатор мероприятий`,
        href: links.console.companyId.eventRubrics.url,
      },
      {
        name: `${rubric.name}`,
        href: links.console.companyId.eventRubrics.rubricSlug.url,
      },
    ],
  };

  return (
    <EventRubricLayout rubric={rubric} breadcrumbs={breadcrumbs}>
      <CreateEvent pageCompany={pageCompany} rubric={rubric} />
    </EventRubricLayout>
  );
};

interface CreateEventPageInterface
  extends GetAppInitialDataPropsInterface,
    CreateEventConsumerInterface {}

const CreateEventPage: NextPage<CreateEventPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <CreateEventConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CreateEventPageInterface>> => {
  const { query } = context;
  const collections = await getDbCollections();
  const rubricsCollection = collections.eventRubricsCollection();
  const { props } = await getConsoleInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  // get company
  const company = props.layoutProps.pageCompany;

  // get rubric
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

  return {
    props: {
      ...props,
      pageCompany: castDbData(company),
      rubric: castDbData(rubric),
    },
  };
};

export default CreateEventPage;
