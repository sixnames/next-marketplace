import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';
import CompanyRubricCategoriesList, {
  CompanyRubricCategoriesListInterface,
} from '../../../../../../components/company/CompanyRubricCategoriesList';
import { ROUTE_CONSOLE } from '../../../../../../config/common';
import {
  COL_CATEGORIES,
  COL_ICONS,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
} from '../../../../../../db/collectionNames';
import { getDatabase } from '../../../../../../db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  CategoryInterface,
  RubricInterface,
  ShopProductInterface,
} from '../../../../../../db/uiInterfaces';
import CmsRubricLayout from '../../../../../../layout/cms/CmsRubricLayout';
import ConsoleLayout from '../../../../../../layout/cms/ConsoleLayout';
import { sortObjectsByField } from '../../../../../../lib/arrayUtils';
import { getFieldStringLocale } from '../../../../../../lib/i18n';
import {
  castDbData,
  getConsoleInitialData,
  GetConsoleInitialDataPropsInterface,
} from '../../../../../../lib/ssrUtils';
import { getTreeFromList } from '../../../../../../lib/treeUtils';

interface RubricCategoriesConsumerInterface extends CompanyRubricCategoriesListInterface {}
const RubricCategoriesConsumer: React.FC<RubricCategoriesConsumerInterface> = ({
  rubric,
  pageCompany,
  routeBasePath,
}) => {
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Категории`,
    config: [
      {
        name: `Рубрикатор`,
        href: `${routeBasePath}/rubrics`,
      },
      {
        name: `${rubric?.name}`,
        href: `${routeBasePath}/rubrics/${rubric?._id}`,
      },
    ],
  };

  return (
    <CmsRubricLayout
      hideAttributesPath
      basePath={routeBasePath}
      rubric={rubric}
      breadcrumbs={breadcrumbs}
    >
      <CompanyRubricCategoriesList
        rubric={rubric}
        routeBasePath={routeBasePath}
        pageCompany={pageCompany}
      />
    </CmsRubricLayout>
  );
};

interface RubricCategoriesPageInterface
  extends GetConsoleInitialDataPropsInterface,
    RubricCategoriesConsumerInterface {}

const RubricCategoriesPage: NextPage<RubricCategoriesPageInterface> = ({
  layoutProps,
  ...props
}) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <RubricCategoriesConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<RubricCategoriesPageInterface>> => {
  const { db } = await getDatabase();
  const rubricsCollection = db.collection<RubricInterface>(COL_RUBRICS);
  const shopProductsCollection = db.collection<ShopProductInterface>(COL_SHOP_PRODUCTS);
  const { query } = context;
  const { props } = await getConsoleInitialData({ context });
  if (!props || !query.rubricId) {
    return {
      notFound: true,
    };
  }

  // get company
  const locale = props.sessionLocale;
  const rubricId = new ObjectId(`${query.rubricId}`);
  const companyId = new ObjectId(`${query.companyId}`);
  const routeBasePath = `${ROUTE_CONSOLE}/${props.layoutProps.pageCompany._id}`;

  // get categories config
  const categoriesConfigAggregationResult = await shopProductsCollection
    .aggregate<ShopProductInterface>([
      {
        $match: {
          companyId,
          rubricId,
        },
      },
      {
        $unwind: {
          path: '$categorySlugs',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: null,
          categorySlugs: {
            $addToSet: '$categorySlugs',
          },
        },
      },
    ])
    .toArray();
  const categoriesConfig = categoriesConfigAggregationResult[0];
  if (!categoriesConfig || categoriesConfig.categorySlugs.length < 1) {
    const rubric = await rubricsCollection.findOne({
      _id: rubricId,
    });

    if (!rubric) {
      return {
        notFound: true,
      };
    }
    const payload: RubricCategoriesConsumerInterface = {
      routeBasePath,
      pageCompany: castDbData(props.layoutProps.pageCompany),
      rubric: {
        ...rubric,
        name: getFieldStringLocale(rubric?.nameI18n, locale),
      },
    };

    const castedPayload = castDbData(payload);

    return {
      props: {
        ...props,
        ...castedPayload,
      },
    };
  }

  // get rubric with categories
  const rubricAggregation = await rubricsCollection
    .aggregate<RubricInterface>([
      {
        $match: {
          _id: rubricId,
        },
      },
      {
        $lookup: {
          from: COL_CATEGORIES,
          as: 'categories',
          let: { rubricId: '$_id' },
          pipeline: [
            {
              $match: {
                slug: {
                  $in: categoriesConfig.categorySlugs,
                },
                $expr: {
                  $eq: ['$rubricId', '$$rubricId'],
                },
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
              },
            },
          ],
        },
      },
    ])
    .toArray();
  const rubric = rubricAggregation[0];
  if (!rubric) {
    return {
      notFound: true,
    };
  }

  const categories = getTreeFromList<CategoryInterface>({
    list: rubric.categories,
    childrenFieldName: 'categories',
  });

  const sortedCategories = sortObjectsByField(categories);

  const payload: RubricCategoriesConsumerInterface = {
    routeBasePath,
    pageCompany: props.layoutProps.pageCompany,
    rubric: {
      ...rubric,
      name: getFieldStringLocale(rubric?.nameI18n, locale),
      categories: sortedCategories,
    },
  };

  const castedPayload = castDbData(payload);

  return {
    props: {
      ...props,
      ...castedPayload,
    },
  };
};

export default RubricCategoriesPage;
