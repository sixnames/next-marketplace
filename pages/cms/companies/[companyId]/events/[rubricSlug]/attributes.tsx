import EventRubricAttributes, {
  EventRubricAttributesInterface,
} from 'components/company/EventRubricAttributes';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import EventRubricLayout, {
  EventRubricLayoutInterface,
} from 'components/layout/events/EventRubricLayout';
import { castEventRubricForUI } from 'db/cast/castRubricForUI';
import { getDbCollections } from 'db/mongodb';
import { getCompanySsr } from 'db/ssr/company/getCompanySsr';
import { AppContentWrapperBreadCrumbs, EventRubricInterface } from 'db/uiInterfaces';
import { rubricAttributeGroupsPipeline } from 'db/utils/constantPipelines';
import { sortObjectsByField } from 'lib/arrayUtils';
import { getFieldStringLocale } from 'lib/i18n';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

interface RubricAttributesConsumerInterface
  extends EventRubricLayoutInterface,
    EventRubricAttributesInterface {}

const RubricAttributesConsumer: React.FC<RubricAttributesConsumerInterface> = ({
  rubric,
  attributeGroups,
  routeBasePath,
  pageCompany,
}) => {
  const links = getProjectLinks({
    companyId: pageCompany._id,
    rubricSlug: rubric.slug,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Атрибуты`,
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
        href: links.cms.companies.companyId.events.url,
      },
      {
        name: `${rubric.name}`,
        href: links.cms.companies.companyId.events.rubricSlug.attributes.url,
      },
    ],
  };

  return (
    <EventRubricLayout
      pageCompany={pageCompany}
      routeBasePath={routeBasePath}
      rubric={rubric}
      breadcrumbs={breadcrumbs}
    >
      <EventRubricAttributes rubric={rubric} attributeGroups={attributeGroups} />
    </EventRubricLayout>
  );
};

interface RubricAttributesPageInterface
  extends GetAppInitialDataPropsInterface,
    RubricAttributesConsumerInterface {}

const RubricAttributesPage: NextPage<RubricAttributesPageInterface> = ({
  layoutProps,
  ...props
}) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <RubricAttributesConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<RubricAttributesPageInterface>> => {
  const { query } = context;
  const collections = await getDbCollections();
  const rubricsCollection = collections.eventRubricsCollection();
  const attributeGroupsCollection = collections.attributesGroupsCollection();

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

  const rawAttributeGroups = await attributeGroupsCollection
    .find({
      _id: {
        $nin: rubric.attributesGroupIds,
      },
    })
    .toArray();
  const castedAttributeGroups = rawAttributeGroups.map((attributeGroup) => {
    return {
      ...attributeGroup,
      name: getFieldStringLocale(attributeGroup.nameI18n, props.sessionLocale),
    };
  });
  const sortedAttributeGroups = sortObjectsByField(castedAttributeGroups);

  const links = getProjectLinks({
    companyId: company._id,
  });

  return {
    props: {
      ...props,
      rubric: castDbData(rubric),
      attributeGroups: castDbData(sortedAttributeGroups),
      pageCompany: castDbData(company),
      routeBasePath: links.cms.companies.companyId.url,
    },
  };
};

export default RubricAttributesPage;
