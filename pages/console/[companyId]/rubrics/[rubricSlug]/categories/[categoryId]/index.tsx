import CompanyRubricCategoryDetails, {
  CompanyRubricCategoryDetailsInterface,
} from 'components/company/CompanyRubricCategoryDetails';
import CmsCategoryLayout from 'components/layout/cms/CmsCategoryLayout';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import { COL_CATEGORIES, COL_ICONS, COL_RUBRICS } from 'db/collectionNames';
import { getDbCollections } from 'db/mongodb';
import { AppContentWrapperBreadCrumbs, CategoryInterface } from 'db/uiInterfaces';
import {
  CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
  CATALOGUE_SEO_TEXT_POSITION_TOP,
} from 'lib/config/common';
import { getFieldStringLocale } from 'lib/i18n';
import { getProjectLinks } from 'lib/links/getProjectLinks';

import { getCategoryAllSeoContents } from 'lib/seoContentUtils';
import {
  castDbData,
  getConsoleInitialData,
  GetConsoleInitialDataPropsInterface,
} from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

interface CategoryDetailsInterface extends CompanyRubricCategoryDetailsInterface {}

const CategoryDetails: React.FC<CategoryDetailsInterface> = ({
  category,
  pageCompany,
  seoDescriptionBottom,
  seoDescriptionTop,
}) => {
  const links = getProjectLinks({
    rubricSlug: category.rubricSlug,
    companyId: pageCompany._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${category.name}`,
    config: [
      {
        name: `Рубрикатор`,
        href: links.console.companyId.rubrics.url,
      },
      {
        name: `${category.rubric?.name}`,
        href: links.console.companyId.rubrics.rubricSlug.url,
      },
      {
        name: `Категории`,
        href: links.console.companyId.rubrics.rubricSlug.categories.url,
      },
    ],
  };

  return (
    <CmsCategoryLayout category={category} breadcrumbs={breadcrumbs} hideAttributesPath>
      <CompanyRubricCategoryDetails
        category={category}
        pageCompany={pageCompany}
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
  const collections = await getDbCollections();
  const categoriesCollection = collections.categoriesCollection();

  const { props } = await getConsoleInitialData({ context });
  if (!props) {
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
      pageCompany: castDbData(props.layoutProps.pageCompany),
    },
  };
};

export default CategoryPage;
