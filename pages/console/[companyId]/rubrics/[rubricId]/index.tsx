import CompanyRubricDetails, {
  CompanyRubricDetailsInterface,
} from 'components/company/CompanyRubricDetails';
import {
  CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
  CATALOGUE_SEO_TEXT_POSITION_TOP,
  ROUTE_CONSOLE,
} from 'config/common';
import { COL_RUBRIC_DESCRIPTIONS, COL_RUBRIC_SEO, COL_RUBRICS } from 'db/collectionNames';
import { RubricModel, RubricSeoModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsRubricLayout from 'layout/cms/CmsRubricLayout';
import ConsoleLayout from 'layout/console/ConsoleLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { ObjectId } from 'mongodb';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getConsoleInitialData } from 'lib/ssrUtils';

interface RubricDetailsInterface extends CompanyRubricDetailsInterface {}

const RubricDetails: React.FC<RubricDetailsInterface> = ({
  rubric,
  seoTop,
  seoBottom,
  currentCompany,
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
        currentCompany={currentCompany}
        seoBottom={seoBottom}
        seoTop={seoTop}
      />
    </CmsRubricLayout>
  );
};

interface RubricPageInterface extends PagePropsInterface, RubricDetailsInterface {}

const RubricPage: NextPage<RubricPageInterface> = ({ pageUrls, ...props }) => {
  return (
    <ConsoleLayout pageUrls={pageUrls} company={props.pageCompany}>
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
  const rubricSeoCollection = db.collection<RubricSeoModel>(COL_RUBRIC_SEO);

  const { props } = await getConsoleInitialData({ context });
  if (!props || !query.rubricId) {
    return {
      notFound: true,
    };
  }
  const companySlug = props.pageCompany.slug;

  const initialRubrics = await rubricsCollection
    .aggregate([
      {
        $match: {
          _id: new ObjectId(`${query.rubricId}`),
        },
      },

      // get top seo text
      {
        $lookup: {
          from: COL_RUBRIC_DESCRIPTIONS,
          as: 'seoDescriptionTop',
          let: {
            rubricId: '$_id',
          },
          pipeline: [
            {
              $match: {
                position: CATALOGUE_SEO_TEXT_POSITION_TOP,
                companySlug,
                $expr: {
                  $eq: ['$$rubricId', '$rubricId'],
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          seoDescriptionTop: {
            $arrayElemAt: ['$seoDescriptionTop', 0],
          },
        },
      },

      // get bottom seo text
      {
        $lookup: {
          from: COL_RUBRIC_DESCRIPTIONS,
          as: 'seoDescriptionBottom',
          let: {
            rubricId: '$_id',
          },
          pipeline: [
            {
              $match: {
                position: CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
                companySlug,
                $expr: {
                  $eq: ['$$rubricId', '$rubricId'],
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          seoDescriptionBottom: {
            $arrayElemAt: ['$seoDescriptionBottom', 0],
          },
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

  const seoTop = await rubricSeoCollection.findOne({
    rubricId: initialRubric._id,
    position: CATALOGUE_SEO_TEXT_POSITION_TOP,
    categoryId: null,
    companySlug,
  });

  const seoBottom = await rubricSeoCollection.findOne({
    rubricId: initialRubric._id,
    position: CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
    categoryId: null,
    companySlug,
  });

  const { sessionLocale } = props;
  const rawRubric = {
    ...initialRubric,
    name: getFieldStringLocale(initialRubric.nameI18n, sessionLocale),
  };

  return {
    props: {
      ...props,
      rubric: castDbData(rawRubric),
      seoTop: castDbData(seoTop),
      seoBottom: castDbData(seoBottom),
      routeBasePath: `${ROUTE_CONSOLE}/${props.pageCompany._id}`,
    },
  };
};

export default RubricPage;
