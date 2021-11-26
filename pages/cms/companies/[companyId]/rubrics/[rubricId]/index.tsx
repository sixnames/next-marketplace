import CompanyRubricDetails, {
  CompanyRubricDetailsInterface,
} from 'components/company/CompanyRubricDetails';
import {
  CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
  CATALOGUE_SEO_TEXT_POSITION_TOP,
  DEFAULT_CITY,
  ROUTE_CMS,
} from 'config/common';
import { COL_COMPANIES, COL_RUBRICS } from 'db/collectionNames';
import { RubricModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { CompanyInterface, RubricInterface } from 'db/uiInterfaces';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import CmsRubricLayout from 'layout/cms/CmsRubricLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { getRubricSeoText } from 'lib/seoTextUtils';
import { ObjectId } from 'mongodb';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';

interface RubricDetailsInterface extends CompanyRubricDetailsInterface {}

const RubricDetails: React.FC<RubricDetailsInterface> = ({
  rubric,
  seoDescriptionTop,
  seoDescriptionBottom,
  pageCompany,
  routeBasePath,
}) => {
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${rubric.name}`,
    config: [
      {
        name: 'Компании',
        href: `${ROUTE_CMS}/companies`,
      },
      {
        name: `${pageCompany?.name}`,
        href: routeBasePath,
      },
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
        rubric={rubric}
        pageCompany={pageCompany}
        routeBasePath={routeBasePath}
        seoDescriptionTop={seoDescriptionTop}
        seoDescriptionBottom={seoDescriptionBottom}
      />
    </CmsRubricLayout>
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
  const { db } = await getDatabase();
  const companiesCollection = db.collection<CompanyInterface>(COL_COMPANIES);
  const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);

  const { props } = await getAppInitialData({ context });
  if (!props || !query.rubricId || !query.companyId) {
    return {
      notFound: true,
    };
  }

  // get company
  const companyId = new ObjectId(`${query.companyId}`);
  const companyAggregationResult = await companiesCollection
    .aggregate([
      {
        $match: {
          _id: companyId,
        },
      },
    ])
    .toArray();
  const companyResult = companyAggregationResult[0];
  if (!companyResult) {
    return {
      notFound: true,
    };
  }
  const companySlug = companyResult.slug;

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

  const seoDescriptionTop = await getRubricSeoText({
    rubricSlug: rubric.slug,
    companySlug,
    position: CATALOGUE_SEO_TEXT_POSITION_TOP,
    citySlug: DEFAULT_CITY,
  });

  const seoDescriptionBottom = await getRubricSeoText({
    rubricSlug: rubric.slug,
    companySlug,
    position: CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
    citySlug: DEFAULT_CITY,
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
      pageCompany: castDbData(companyResult),
      routeBasePath: `${ROUTE_CMS}/companies/${companyResult._id}`,
    },
  };
};

export default RubricPage;
