import { ObjectId } from 'mongodb';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import CompanyRubricCategoryDetails, {
  CompanyRubricCategoryDetailsInterface,
} from '../../../../../../../components/company/CompanyRubricCategoryDetails';
import {
  CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
  CATALOGUE_SEO_TEXT_POSITION_TOP,
  ROUTE_CONSOLE,
} from '../../../../../../../config/common';
import { COL_CATEGORIES, COL_ICONS, COL_RUBRICS } from '../../../../../../../db/collectionNames';
import { getDatabase } from '../../../../../../../db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  CategoryInterface,
} from '../../../../../../../db/uiInterfaces';
import CmsCategoryLayout from '../../../../../../../layout/cms/CmsCategoryLayout';
import ConsoleLayout from '../../../../../../../layout/cms/ConsoleLayout';
import { getFieldStringLocale } from '../../../../../../../lib/i18n';
import { getCategoryAllSeoContents } from '../../../../../../../lib/seoContentUtils';
import {
  castDbData,
  getConsoleInitialData,
  GetConsoleInitialDataPropsInterface,
} from '../../../../../../../lib/ssrUtils';

interface CategoryDetailsInterface extends CompanyRubricCategoryDetailsInterface {}

const CategoryDetails: React.FC<CategoryDetailsInterface> = ({
  category,
  pageCompany,
  seoDescriptionBottom,
  seoDescriptionTop,
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
        pageCompany={pageCompany}
        routeBasePath={routeBasePath}
        seoDescriptionTop={seoDescriptionTop}
        seoDescriptionBottom={seoDescriptionBottom}
      />
    </CmsCategoryLayout>
  );
};

interface CategoryPageInterface
  extends GetConsoleInitialDataPropsInterface,
    CategoryDetailsInterface {}

const CategoryPage: NextPage<CategoryPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
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

  const { props } = await getConsoleInitialData({ context });
  if (!props || !query.categoryId) {
    return {
      notFound: true,
    };
  }

  const companySlug = props.layoutProps.pageCompany.slug;

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

  const seoDescriptionTop = await getCategoryAllSeoContents({
    position: CATALOGUE_SEO_TEXT_POSITION_TOP,
    categoryId: category._id,
    companySlug,
    rubricSlug: category.rubricSlug,
    locale: sessionLocale,
  });

  const seoDescriptionBottom = await getCategoryAllSeoContents({
    position: CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
    categoryId: category._id,
    companySlug,
    rubricSlug: category.rubricSlug,
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
      category: castDbData(category),
      routeBasePath: `${ROUTE_CONSOLE}/${props.layoutProps.pageCompany._id}`,
      pageCompany: castDbData(props.layoutProps.pageCompany),
    },
  };
};

export default CategoryPage;
