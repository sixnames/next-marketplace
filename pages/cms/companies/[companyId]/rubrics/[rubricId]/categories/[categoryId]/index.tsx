import CompanyRubricCategoryDetails, {
  CompanyRubricCategoryDetailsInterface,
} from 'components/company/CompanyRubricCategoryDetails';
import {
  CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
  CATALOGUE_SEO_TEXT_POSITION_TOP,
  ROUTE_CMS,
} from 'config/common';
import {
  COL_CATEGORIES,
  COL_CATEGORY_DESCRIPTIONS,
  COL_COMPANIES,
  COL_ICONS,
  COL_RUBRIC_SEO,
  COL_RUBRICS,
} from 'db/collectionNames';
import { RubricSeoModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { CategoryInterface, CompanyInterface } from 'db/uiInterfaces';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsCategoryLayout from 'layout/cms/CmsCategoryLayout';
import CmsLayout from 'layout/cms/CmsLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { ObjectId } from 'mongodb';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';

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
        name: 'Компании',
        href: `${ROUTE_CMS}/companies`,
      },
      {
        name: `${currentCompany?.name}`,
        href: routeBasePath,
      },
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
    <CmsLayout pageUrls={pageUrls}>
      <CategoryDetails {...props} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CategoryPageInterface>> => {
  const { query } = context;
  const { db } = await getDatabase();
  const categoriesCollection = db.collection<CategoryInterface>(COL_CATEGORIES);
  const rubricSeoCollection = db.collection<RubricSeoModel>(COL_RUBRIC_SEO);
  const companiesCollection = db.collection<CompanyInterface>(COL_COMPANIES);

  const { props } = await getAppInitialData({ context });
  if (!props || !query.categoryId || !query.companyId) {
    return {
      notFound: true,
    };
  }

  // get company
  const companyId = new ObjectId(`${query.companyId}`);
  const companyAggregationResult = await companiesCollection
    .aggregate<CompanyInterface>([
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
      pageCompany: castDbData(companyResult),
      routeBasePath: `${ROUTE_CMS}/companies/${companyResult._id}`,
    },
  };
};

export default CategoryPage;
