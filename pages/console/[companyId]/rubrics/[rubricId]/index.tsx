import CompanyRubricDetails, {
  CompanyRubricDetailsInterface,
} from 'components/company/CompanyRubricDetails';
import {
  CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
  CATALOGUE_SEO_TEXT_POSITION_TOP,
  ROUTE_CONSOLE,
} from 'config/common';
import { COL_RUBRICS } from 'db/collectionNames';
import { RubricModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { RubricInterface } from 'db/uiInterfaces';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsRubricLayout from 'layout/cms/CmsRubricLayout';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { getRubricAllSeoContents } from 'lib/seoContentUtils';
import { ObjectId } from 'mongodb';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import {
  castDbData,
  getConsoleInitialData,
  GetConsoleInitialDataPropsInterface,
} from 'lib/ssrUtils';

interface RubricDetailsInterface extends CompanyRubricDetailsInterface {}

const RubricDetails: React.FC<RubricDetailsInterface> = ({
  rubric,
  seoDescriptionBottom,
  seoDescriptionTop,
  pageCompany,
  routeBasePath,
}) => {
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${rubric.name}`,
    config: [
      {
        name: `Рубрикатор`,
        href: `${routeBasePath}/rubrics`,
      },
    ],
  };

  return (
    <CmsRubricLayout
      hideAttributesPath
      rubric={rubric}
      breadcrumbs={breadcrumbs}
      basePath={routeBasePath}
    >
      <CompanyRubricDetails
        routeBasePath={routeBasePath}
        rubric={rubric}
        pageCompany={pageCompany}
        seoDescriptionTop={seoDescriptionTop}
        seoDescriptionBottom={seoDescriptionBottom}
      />
    </CmsRubricLayout>
  );
};

interface RubricPageInterface extends GetConsoleInitialDataPropsInterface, RubricDetailsInterface {}

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
  const { db } = await getDatabase();
  const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);

  const { props } = await getConsoleInitialData({ context });
  if (!props || !query.rubricId) {
    return {
      notFound: true,
    };
  }
  const companySlug = props.layoutProps.pageCompany.slug;

  const initialRubrics = await rubricsCollection
    .aggregate<RubricInterface>([
      {
        $match: {
          _id: new ObjectId(`${query.rubricId}`),
        },
      },
      {
        $project: {
          attributes: false,
          priorities: false,
          views: false,
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

  const { sessionLocale } = props;
  const rubric = {
    ...initialRubric,
    name: getFieldStringLocale(initialRubric.nameI18n, sessionLocale),
  };

  const seoDescriptionTop = await getRubricAllSeoContents({
    rubricSlug: rubric.slug,
    rubricId: rubric._id,
    companySlug,
    position: CATALOGUE_SEO_TEXT_POSITION_TOP,
    locale: sessionLocale,
  });

  const seoDescriptionBottom = await getRubricAllSeoContents({
    rubricSlug: rubric.slug,
    rubricId: rubric._id,
    companySlug,
    position: CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
    locale: sessionLocale,
  });

  if (!seoDescriptionBottom || !seoDescriptionTop) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...props,
      seoDescriptionBottom: castDbData(seoDescriptionBottom),
      seoDescriptionTop: castDbData(seoDescriptionTop),
      rubric: castDbData(rubric),
      routeBasePath: `${ROUTE_CONSOLE}/${props.layoutProps.pageCompany._id}`,
      pageCompany: castDbData(props.layoutProps.pageCompany),
    },
  };
};

export default RubricPage;
