import ContentItemControls from 'components/button/ContentItemControls';
import FixedButtons from 'components/button/FixedButtons';
import WpButton from 'components/button/WpButton';
import Inner from 'components/Inner';
import CmsRubricLayout from 'components/layout/cms/CmsRubricLayout';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import { CreateCategoryModalInterface } from 'components/Modal/CreateCategoryModal';
import RequestError from 'components/RequestError';
import WpImage from 'components/WpImage';
import { COL_CATEGORIES, COL_ICONS } from 'db/collectionNames';
import { getDbCollections } from 'db/mongodb';
import { AppContentWrapperBreadCrumbs, CategoryInterface, RubricInterface } from 'db/uiInterfaces';
import { useDeleteCategoryMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import { sortObjectsByField } from 'lib/arrayUtils';
import { DEFAULT_LOCALE, SORT_ASC } from 'lib/config/common';
import { CONFIRM_MODAL, CREATE_CATEGORY_MODAL } from 'lib/config/modalVariants';
import { getFieldStringLocale } from 'lib/i18n';

import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { getTreeFromList } from 'lib/treeUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

interface RubricCategoriesConsumerInterface {
  rubric: RubricInterface;
}

const RubricCategoriesConsumer: React.FC<RubricCategoriesConsumerInterface> = ({ rubric }) => {
  const { showModal, onCompleteCallback, onErrorCallback, showLoading } = useMutationCallbacks({
    withModal: true,
    reload: true,
  });

  const [deleteCategoryMutation] = useDeleteCategoryMutation({
    onCompleted: (data) => onCompleteCallback(data.deleteCategory),
    onError: onErrorCallback,
  });

  const links = getProjectLinks({
    rubricSlug: rubric.slug,
  });

  const renderCategories = React.useCallback(
    (category: CategoryInterface) => {
      const { name, categories, image } = category;
      const categoryLinks = getProjectLinks({
        rubricSlug: rubric.slug,
        categoryId: category._id,
      });
      const categoryUrl = categoryLinks.category.root;
      return (
        <div data-cy={`${name}`} data-url={categoryUrl}>
          {image ? (
            <div className='mb-4 w-[80px]'>
              <div className='relative w-full pb-[100%]'>
                <WpImage
                  url={image}
                  alt={`${name}`}
                  title={`${name}`}
                  width={80}
                  className='absolute inset-0 h-full w-full object-contain'
                />
              </div>
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
                createTitle={'Добавить дочернюю категорию'}
                createHandler={() => {
                  showModal<CreateCategoryModalInterface>({
                    variant: CREATE_CATEGORY_MODAL,
                    props: {
                      parentId: `${category._id}`,
                      rubricId: `${rubric._id}`,
                    },
                  });
                }}
                updateTitle={'Редактировать категорию'}
                updateHandler={() => {
                  window.open(categoryUrl, '_blank');
                }}
                deleteTitle={'Удалить категорию'}
                deleteHandler={() => {
                  showModal({
                    variant: CONFIRM_MODAL,
                    props: {
                      testId: 'delete-category-modal',
                      message: 'Категория будет удалена',
                      confirm: () => {
                        showLoading();
                        return deleteCategoryMutation({
                          variables: {
                            _id: category._id,
                          },
                        });
                      },
                    },
                  });
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
    [deleteCategoryMutation, rubric._id, rubric.slug, showLoading, showModal],
  );

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Категории',
    config: [
      {
        name: 'Рубрикатор',
        href: links.parentLink,
      },
      {
        name: `${rubric.name}`,
        href: links.parentLink,
      },
    ],
  };

  const { categories } = rubric;

  return (
    <CmsRubricLayout rubric={rubric} breadcrumbs={breadcrumbs}>
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

          <FixedButtons>
            <WpButton
              testId={'create-category'}
              size={'small'}
              onClick={() => {
                showModal<CreateCategoryModalInterface>({
                  variant: CREATE_CATEGORY_MODAL,
                  props: {
                    rubricId: `${rubric._id}`,
                  },
                });
              }}
            >
              Создать категорию
            </WpButton>
          </FixedButtons>
        </div>
      </Inner>
    </CmsRubricLayout>
  );
};

interface RubricCategoriesPageInterface
  extends GetAppInitialDataPropsInterface,
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
  const { query } = context;
  const initialProps = await getAppInitialData({ context });
  if (!initialProps.props) {
    return {
      notFound: true,
    };
  }
  const locale = initialProps.props.sessionLocale;
  const rubricAggregation = await rubricsCollection
    .aggregate<RubricInterface>([
      {
        $match: {
          slug: `${query.rubricSlug}`,
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
            {
              $sort: {
                [`nameI18n.${DEFAULT_LOCALE}`]: SORT_ASC,
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
