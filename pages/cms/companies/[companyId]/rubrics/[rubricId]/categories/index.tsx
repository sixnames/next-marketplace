import ContentItemControls from 'components/ContentItemControls';
import Inner from 'components/Inner';
import RequestError from 'components/RequestError';
import { ROUTE_CMS } from 'config/common';
import {
  COL_CATEGORIES,
  COL_COMPANIES,
  COL_ICONS,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
} from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import {
  CategoryInterface,
  CompanyInterface,
  RubricInterface,
  ShopProductInterface,
} from 'db/uiInterfaces';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsLayout from 'layout/cms/CmsLayout';
import CmsRubricLayout from 'layout/cms/CmsRubricLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { getTreeFromList, sortByName } from 'lib/optionsUtils';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';

interface RubricCategoriesConsumerInterface {
  rubric: RubricInterface;
  currentCompany?: CompanyInterface | null;
}

const RubricCategoriesConsumer: React.FC<RubricCategoriesConsumerInterface> = ({
  rubric,
  currentCompany,
}) => {
  const router = useRouter();
  const routeBasePath = React.useMemo(() => {
    return `${ROUTE_CMS}/companies/${currentCompany?._id}`;
  }, [currentCompany]);

  const renderCategories = React.useCallback(
    (category: CategoryInterface) => {
      const { name, categories, image } = category;

      return (
        <div>
          {image ? (
            <div>
              <Image
                src={image}
                width={80}
                height={80}
                quality={50}
                alt={`${name}`}
                title={`${name}`}
                objectFit={'contain'}
                objectPosition={'center'}
              />
            </div>
          ) : null}

          <div className='cms-option flex items-center gap-4'>
            {category.icon ? (
              <div
                className='categories-icon-preview'
                dangerouslySetInnerHTML={{ __html: category.icon.icon }}
              />
            ) : null}
            <div className='font-medium' data-cy={`category-${name}`}>
              {name}
            </div>
            <div className='cms-option__controls'>
              <ContentItemControls
                testId={`${name}`}
                justifyContent={'flex-end'}
                updateTitle={'Редактировать категорию'}
                updateHandler={() => {
                  router
                    .push(`${routeBasePath}/rubrics/${rubric._id}/categories/${category._id}`)
                    .catch(console.log);
                }}
              />
            </div>
          </div>
          {categories && categories.length > 0 ? (
            <div className='ml-4'>
              {categories.map((category) => (
                <div className='mt-4' key={`${category._id}`}>
                  {renderCategories(category)}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      );
    },
    [routeBasePath, router, rubric._id],
  );

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Категории`,
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
        name: `${rubric?.name}`,
        href: `${routeBasePath}/rubrics/${rubric?._id}`,
      },
    ],
  };

  const { categories } = rubric;

  return (
    <CmsRubricLayout
      hideAttributesPath
      basePath={routeBasePath}
      rubric={rubric}
      breadcrumbs={breadcrumbs}
    >
      <Inner testId={'rubric-categories-list'}>
        <div className='relative'>
          {!categories || categories.length < 1 ? (
            <RequestError message={'Список пуст'} />
          ) : (
            <div className='border-t border-border-300'>
              {categories.map((category) => (
                <div
                  className='border-b border-border-300 py-6 px-inner-block-horizontal-padding'
                  key={`${category._id}`}
                >
                  {renderCategories(category)}
                </div>
              ))}
            </div>
          )}
        </div>
      </Inner>
    </CmsRubricLayout>
  );
};

interface RubricCategoriesPageInterface
  extends PagePropsInterface,
    RubricCategoriesConsumerInterface {}

const RubricCategoriesPage: NextPage<RubricCategoriesPageInterface> = ({ pageUrls, ...props }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <RubricCategoriesConsumer {...props} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<RubricCategoriesPageInterface>> => {
  const { db } = await getDatabase();
  const rubricsCollection = db.collection<RubricInterface>(COL_RUBRICS);
  const companiesCollection = db.collection<CompanyInterface>(COL_COMPANIES);
  const shopProductsCollection = db.collection<ShopProductInterface>(COL_SHOP_PRODUCTS);
  const { query } = context;
  const initialProps = await getAppInitialData({ context });
  if (!initialProps.props || !query.rubricId || !query.companyId) {
    return {
      notFound: true,
    };
  }

  // get company
  const locale = initialProps.props.sessionLocale;
  const rubricId = new ObjectId(`${query.rubricId}`);
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
          path: '$selectedOptionsSlugs',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: null,
          selectedOptionsSlugs: {
            $addToSet: '$selectedOptionsSlugs',
          },
        },
      },
    ])
    .toArray();
  const categoriesConfig = categoriesConfigAggregationResult[0];
  if (!categoriesConfig || categoriesConfig.selectedOptionsSlugs.length < 1) {
    const rubric = await rubricsCollection.findOne({
      _id: rubricId,
    });

    if (!rubric) {
      return {
        notFound: true,
      };
    }

    const payload: RubricCategoriesConsumerInterface = {
      currentCompany: castDbData(companyResult),
      rubric: {
        ...rubric,
        name: getFieldStringLocale(rubric?.nameI18n, locale),
      },
    };

    const castedPayload = castDbData(payload);

    return {
      props: {
        ...initialProps.props,
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
                  $in: categoriesConfig.selectedOptionsSlugs,
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

  const sortedCategories = sortByName(categories);

  const payload: RubricCategoriesConsumerInterface = {
    currentCompany: companyResult,
    rubric: {
      ...rubric,
      name: getFieldStringLocale(rubric?.nameI18n, locale),
      categories: sortedCategories,
    },
  };

  const castedPayload = castDbData(payload);

  return {
    props: {
      ...initialProps.props,
      ...castedPayload,
    },
  };
};

export default RubricCategoriesPage;
