import CompanyRubricCategoriesList, {
  CompanyRubricCategoriesListInterface,
} from 'components/company/CompanyRubricCategoriesList';
import CmsRubricLayout from 'components/layout/cms/CmsRubricLayout';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import { COL_CATEGORIES, COL_ICONS } from 'db/collectionNames';
import { getDbCollections } from 'db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  CategoryInterface,
  RubricInterface,
  ShopProductInterface,
} from 'db/uiInterfaces';
import { sortObjectsByField } from 'lib/arrayUtils';
import { getFieldStringLocale } from 'lib/i18n';
import { getConsoleCompanyLinks } from 'lib/linkUtils';
import {
  castDbData,
  getConsoleInitialData,
  GetConsoleInitialDataPropsInterface,
} from 'lib/ssrUtils';
import { getTreeFromList } from 'lib/treeUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

interface RubricCategoriesConsumerInterface extends CompanyRubricCategoriesListInterface {}
const RubricCategoriesConsumer: React.FC<RubricCategoriesConsumerInterface> = ({
  rubric,
  pageCompany,
  routeBasePath,
}) => {
  const links = getConsoleCompanyLinks({
    companyId: pageCompany?._id,
    rubricSlug: rubric?.slug,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Категории`,
    config: [
      {
        name: `Рубрикатор`,
        href: links.rubrics.parentLink,
      },
      {
        name: `${rubric?.name}`,
        href: links.rubrics.root,
      },
    ],
  };

  return (
    <CmsRubricLayout
      hideAttributesPath
      basePath={links.root}
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
  const collections = await getDbCollections();
  const rubricsCollection = collections.rubricsCollection();
  const shopProductsCollection = collections.shopProductsCollection();
  const { query } = context;
  const { props } = await getConsoleInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  // get company
  const locale = props.sessionLocale;
  const rubricSlug = `${query.rubricSlug}`;
  const companyId = new ObjectId(`${query.companyId}`);
  const links = getConsoleCompanyLinks({
    companyId: props.layoutProps.pageCompany._id,
    rubricSlug,
  });
  const routeBasePath = links.parentLink;

  // get categories config
  const categoriesConfigAggregationResult = await shopProductsCollection
    .aggregate<ShopProductInterface>([
      {
        $match: {
          companyId,
          rubricSlug,
        },
      },
      {
        $unwind: {
          path: '$filterSlugs',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: null,
          filterSlugs: {
            $addToSet: '$filterSlugs',
          },
        },
      },
    ])
    .toArray();
  const categoriesConfig = categoriesConfigAggregationResult[0];
  if (!categoriesConfig || categoriesConfig.filterSlugs.length < 1) {
    const rubric = await rubricsCollection.findOne({
      slug: rubricSlug,
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
          slug: rubricSlug,
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
                  $in: categoriesConfig.filterSlugs,
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
