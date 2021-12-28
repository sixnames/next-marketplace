import { ObjectId } from 'mongodb';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import CompanyRubricDetails, {
  CompanyRubricDetailsInterface,
} from '../../../../../../components/company/CompanyRubricDetails';
import {
  CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
  CATALOGUE_SEO_TEXT_POSITION_TOP,
} from '../../../../../../config/common';
import { COL_COMPANIES, COL_RUBRICS } from '../../../../../../db/collectionNames';
import { RubricModel } from '../../../../../../db/dbModels';
import { getDatabase } from '../../../../../../db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  CompanyInterface,
  RubricInterface,
} from '../../../../../../db/uiInterfaces';
import CmsRubricLayout from '../../../../../../layout/cms/CmsRubricLayout';
import { getFieldStringLocale } from '../../../../../../lib/i18n';
import { getConsoleCompanyLinks } from '../../../../../../lib/linkUtils';
import { getRubricAllSeoContents } from '../../../../../../lib/seoContentUtils';
import {
  castDbData,
  getAppInitialData,
  GetAppInitialDataPropsInterface,
} from '../../../../../../lib/ssrUtils';
import ConsoleLayout from '../../../../../../layout/cms/ConsoleLayout';

interface RubricDetailsInterface extends CompanyRubricDetailsInterface {}

const RubricDetails: React.FC<RubricDetailsInterface> = ({
  rubric,
  seoDescriptionTop,
  seoDescriptionBottom,
  pageCompany,
  routeBasePath,
}) => {
  const links = getConsoleCompanyLinks({
    companyId: pageCompany._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${rubric.name}`,
    config: [
      {
        name: 'Компании',
        href: links.parentLink,
      },
      {
        name: `${pageCompany?.name}`,
        href: links.root,
      },
      {
        name: `Рубрикатор`,
        href: links.rubrics.parentLink,
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

  const seoDescriptionTop = await getRubricAllSeoContents({
    rubricSlug: rubric.slug,
    rubricId: rubric._id,
    companySlug,
    position: CATALOGUE_SEO_TEXT_POSITION_TOP,
    locale: props.sessionLocale,
  });

  const seoDescriptionBottom = await getRubricAllSeoContents({
    rubricSlug: rubric.slug,
    rubricId: rubric._id,
    companySlug,
    position: CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
    locale: props.sessionLocale,
  });

  if (!seoDescriptionBottom || !seoDescriptionTop) {
    return {
      notFound: true,
    };
  }

  const links = getConsoleCompanyLinks({
    companyId: companyResult._id,
  });

  return {
    props: {
      ...props,
      seoDescriptionBottom: castDbData(seoDescriptionBottom),
      seoDescriptionTop: castDbData(seoDescriptionTop),
      rubric: castDbData(rubric),
      pageCompany: castDbData(companyResult),
      routeBasePath: links.root,
    },
  };
};

export default RubricPage;
