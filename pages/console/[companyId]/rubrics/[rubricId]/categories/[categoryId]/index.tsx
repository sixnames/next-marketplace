import CompanyRubricCategoryDetails, {
  CompanyRubricCategoryDetailsInterface,
} from 'components/company/CompanyRubricCategoryDetails';
import {
  CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
  CATALOGUE_SEO_TEXT_POSITION_TOP,
  ROUTE_CONSOLE,
} from 'config/common';
import {
  COL_CATEGORIES,
  COL_CATEGORY_DESCRIPTIONS,
  COL_ICONS,
  COL_RUBRIC_SEO,
  COL_RUBRICS,
} from 'db/collectionNames';
import { RubricSeoModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { CategoryInterface } from 'db/uiInterfaces';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsCategoryLayout from 'layout/cms/CmsCategoryLayout';
import ConsoleLayout from 'layout/console/ConsoleLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { ObjectId } from 'mongodb';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getConsoleInitialData } from 'lib/ssrUtils';

interface CategoryDetailsInterface extends CompanyRubricCategoryDetailsInterface {}

const CategoryDetails: React.FC<CategoryDetailsInterface> = ({
  category,
  currentCompany,
  seoTop,
  seoBottom,
  routeBasePath,
}) => {
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${category.name}`,
    config: [
      {
        name: `Рубрикатор`,
        href: `${routeBasePath}/rubrics`,
      },
      {
        name: `${category.rubric?.name}`,
        href: `${routeBasePath}/rubrics/${category.rubric?._id}`,
      },
      {
        name: `Категории`,
        href: `${routeBasePath}/rubrics/${category.rubricId}/categories`,
      },
    ],
  };

  return (
    <CmsCategoryLayout
      category={category}
      breadcrumbs={breadcrumbs}
      basePath={routeBasePath}
      hideAttributesPath
    >
      <CompanyRubricCategoryDetails
        category={category}
        currentCompany={currentCompany}
        seoTop={seoTop}
        seoBottom={seoBottom}
        routeBasePath={routeBasePath}
      />
    </CmsCategoryLayout>
  );
};

interface CategoryPageInterface extends PagePropsInterface, CategoryDetailsInterface {}

const CategoryPage: NextPage<CategoryPageInterface> = ({ pageUrls, ...props }) => {
  return (
    <ConsoleLayout pageUrls={pageUrls} company={props.currentCompany}>
      <CategoryDetails {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CategoryPageInterface>> => {
  const { query } = context;
  const { db } = await getDatabase();
  const categoriesCollection = db.collection<CategoryInterface>(COL_CATEGORIES);
  const rubricSeoCollection = db.collection<RubricSeoModel>(COL_RUBRIC_SEO);

  const { props } = await getConsoleInitialData({ context });
  if (!props || !query.categoryId) {
    return {
      notFound: true,
    };
  }

  const companySlug = props.currentCompany.slug;

  const categoryAggregation = await categoriesCollection
    .aggregate<CategoryInterface>([
      {
        $match: {
          _id: new ObjectId(`${query.categoryId}`),
        },
      },
      {
        $lookup: {
          from: COL_RUBRICS,
          as: 'rubric',
          let: {
            rubricId: '$rubricId',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$rubricId'],
                },
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: COL_ICONS,
          as: 'icon',
          let: {
            documentId: '$_id',
          },
          pipeline: [
            {
              $match: {
                collectionName: COL_CATEGORIES,
                $expr: {
                  $eq: ['$documentId', '$$documentId'],
                },
              },
            },
          ],
        },
      },

      // get top seo text
      {
        $lookup: {
          from: COL_CATEGORY_DESCRIPTIONS,
          as: 'seoDescriptionTop',
          let: {
            categoryId: '$_id',
          },
          pipeline: [
            {
              $match: {
                position: CATALOGUE_SEO_TEXT_POSITION_TOP,
                companySlug,
                $expr: {
                  $eq: ['$$categoryId', '$categoryId'],
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
          from: COL_CATEGORY_DESCRIPTIONS,
          as: 'seoDescriptionBottom',
          let: {
            categoryId: '$_id',
          },
          pipeline: [
            {
              $match: {
                position: CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
                companySlug,
                $expr: {
                  $eq: ['$$categoryId', '$categoryId'],
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
        $addFields: {
          icon: {
            $arrayElemAt: ['$icon', 0],
          },
          rubric: {
            $arrayElemAt: ['$rubric', 0],
          },
        },
      },
    ])
    .toArray();
  const initialCategory = categoryAggregation[0];
  if (!initialCategory) {
    return {
      notFound: true,
    };
  }

  const { sessionLocale } = props;
  const category: CategoryInterface = {
    ...initialCategory,
    name: getFieldStringLocale(initialCategory.nameI18n, sessionLocale),
    rubric: initialCategory.rubric
      ? {
          ...initialCategory.rubric,
          name: getFieldStringLocale(initialCategory.rubric.nameI18n, sessionLocale),
        }
      : null,
  };

  const seoTop = await rubricSeoCollection.findOne({
    categoryId: category._id,
    position: CATALOGUE_SEO_TEXT_POSITION_TOP,
    companySlug,
  });

  const seoBottom = await rubricSeoCollection.findOne({
    categoryId: category._id,
    position: CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
    companySlug,
  });

  return {
    props: {
      ...props,
      category: castDbData(category),
      seoTop: castDbData(seoTop),
      seoBottom: castDbData(seoBottom),
      routeBasePath: `${ROUTE_CONSOLE}/${props.currentCompany._id}`,
    },
  };
};

export default CategoryPage;
