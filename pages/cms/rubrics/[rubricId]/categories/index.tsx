import Button from 'components/Button';
import ContentItemControls from 'components/ContentItemControls';
import FixedButtons from 'components/FixedButtons';
import Icon from 'components/Icon';
import Inner from 'components/Inner';
import { CreateCategoryModalInterface } from 'components/Modal/CreateCategoryModal';
import RequestError from 'components/RequestError';
import { DEFAULT_LOCALE, ROUTE_CMS, SORT_ASC } from 'config/common';
import { CONFIRM_MODAL, CREATE_CATEGORY_MODAL } from 'config/modalVariants';
import { COL_CATEGORIES, COL_RUBRICS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { CategoryInterface, RubricInterface } from 'db/uiInterfaces';
import { useDeleteCategoryMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import CmsRubricLayout from 'layout/CmsLayout/CmsRubricLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { getTreeFromList } from 'lib/optionsUtils';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import Image from 'next/image';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';

interface RubricCategoriesConsumerInterface {
  rubric: RubricInterface;
}

const RubricCategoriesConsumer: React.FC<RubricCategoriesConsumerInterface> = ({ rubric }) => {
  const { showModal, onCompleteCallback, onErrorCallback, showLoading, router } =
    useMutationCallbacks({
      withModal: true,
      reload: true,
    });

  const [deleteCategoryMutation] = useDeleteCategoryMutation({
    onCompleted: (data) => onCompleteCallback(data.deleteCategory),
    onError: onErrorCallback,
  });

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

          <div className='cms-option flex items-center'>
            {category.icon ? (
              <div className='mr-4'>
                <Icon name={category.icon} className='w-6 h-6' />
              </div>
            ) : null}
            <div className='font-medium' data-cy={`option-${name}`}>
              {name}
            </div>
            <div className='cms-option__controls ml-4'>
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
                  router
                    .push(`${ROUTE_CMS}/rubrics/${rubric._id}/categories/${category._id}`)
                    .catch(console.log);
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
    [deleteCategoryMutation, router, rubric._id, showLoading, showModal],
  );

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Категории',
    config: [
      {
        name: 'Рубрикатор',
        href: `${ROUTE_CMS}/rubrics`,
      },
      {
        name: `${rubric.name}`,
        href: `${ROUTE_CMS}/rubrics/${rubric._id}`,
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
            <div className='border-t border-border-color'>
              {categories.map((category) => (
                <div
                  className='border-b border-border-color py-6 px-inner-block-horizontal-padding'
                  key={`${category._id}`}
                >
                  {renderCategories(category)}
                </div>
              ))}
            </div>
          )}

          <FixedButtons>
            <Button
              testId={'create-rubric-product'}
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
            </Button>
          </FixedButtons>
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
  const { query } = context;
  const { rubricId } = query;
  const initialProps = await getAppInitialData({ context });
  if (!initialProps.props || !rubricId) {
    return {
      notFound: true,
    };
  }
  const locale = initialProps.props.sessionLocale;
  const rubricAggregation = await rubricsCollection
    .aggregate([
      {
        $match: {
          _id: new ObjectId(`${rubricId}`),
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
  const payload: RubricCategoriesConsumerInterface = {
    rubric: {
      ...rubric,
      name: getFieldStringLocale(rubric?.nameI18n, locale),
      categories: getTreeFromList<CategoryInterface>({
        list: rubric.categories,
        childrenFieldName: 'categories',
      }),
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
