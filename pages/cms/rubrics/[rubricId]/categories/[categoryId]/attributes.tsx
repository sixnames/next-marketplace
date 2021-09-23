import Accordion from 'components/Accordion';
import Button from 'components/Button';
import FixedButtons from 'components/FixedButtons';
import ContentItemControls from 'components/ContentItemControls';
import CheckBox from 'components/FormElements/Checkbox/Checkbox';
import Inner from 'components/Inner';
import Link from 'components/Link/Link';
import { AddAttributesGroupToRubricModalInterface } from 'components/Modal/AddAttributesGroupToRubricModal';
import Table, { TableColumn } from 'components/Table';
import { ROUTE_CMS, SORT_ASC, SORT_DESC } from 'config/common';
import { getConstantTranslation } from 'config/constantTranslations';
import { ADD_ATTRIBUTES_GROUP_TO_RUBRIC_MODAL, CONFIRM_MODAL } from 'config/modalVariants';
import { useLocaleContext } from 'context/localeContext';
import {
  COL_ATTRIBUTES_GROUPS,
  COL_CATEGORIES,
  COL_ATTRIBUTES,
  COL_RUBRICS,
} from 'db/collectionNames';
import { ObjectIdModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { CategoryInterface, AttributeInterface } from 'db/uiInterfaces';
import {
  useAddAttributesGroupToCategoryMutation,
  useDeleteAttributesGroupFromCategoryMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsCategoryLayout from 'layout/CmsLayout/CmsCategoryLayout';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { castCategoryForUI } from 'lib/uiDataUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';

interface CategoryAttributesConsumerInterface {
  category: CategoryInterface;
  excludedAttributesGroupsIds: ObjectIdModel[];
}

const CategoryAttributesConsumer: React.FC<CategoryAttributesConsumerInterface> = ({
  category,
  excludedAttributesGroupsIds,
}) => {
  const { locale } = useLocaleContext();
  const { showModal, onCompleteCallback, onErrorCallback, showLoading } = useMutationCallbacks({
    withModal: true,
    reload: true,
  });

  const [deleteAttributesGroupFromCategoryMutation] = useDeleteAttributesGroupFromCategoryMutation({
    onCompleted: (data) => onCompleteCallback(data.deleteAttributesGroupFromCategory),
    onError: onErrorCallback,
  });

  const [addAttributesGroupToCategoryMutation] = useAddAttributesGroupToCategoryMutation({
    onCompleted: (data) => onCompleteCallback(data.addAttributesGroupToCategory),
    onError: onErrorCallback,
  });

  const columns = (columnCategory: CategoryInterface) => {
    const payload: TableColumn<AttributeInterface>[] = [
      {
        accessor: 'name',
        headTitle: 'Название',
        render: ({ cellData }) => cellData,
      },
      {
        accessor: 'variant',
        headTitle: 'Тип',
        render: ({ cellData }) =>
          getConstantTranslation(`selectsOptions.attributeVariants.${cellData}.${locale}`),
      },
      {
        accessor: 'metric',
        headTitle: 'Единица измерения',
        render: ({ cellData }) => cellData?.name || null,
      },
      {
        accessor: 'showInRubricFilter',
        headTitle: 'Показывать в фильтре рубрики',
        render: ({ cellData, dataItem }) => {
          return (
            <CheckBox
              disabled
              value={cellData}
              name={dataItem.slug}
              checked={cellData}
              onChange={(e: any) => {
                console.log(e?.target?.checked);
              }}
            />
          );
        },
      },
      {
        headTitle: 'Категория',
        render: () => {
          if (columnCategory && columnCategory._id !== category._id) {
            return (
              <Link
                href={`${ROUTE_CMS}/rubrics/${columnCategory.rubric?._id}/categories/${columnCategory._id}/attributes`}
              >
                {columnCategory.name}
              </Link>
            );
          }
          return null;
        },
      },
    ];
    return payload;
  };

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Атрибуты',
    config: [
      {
        name: 'Рубрикатор',
        href: `${ROUTE_CMS}/rubrics`,
      },
      {
        name: `${category.rubric?.name}`,
        href: `${ROUTE_CMS}/rubrics/${category.rubricId}`,
      },
      {
        name: `Категории`,
        href: `${ROUTE_CMS}/rubrics/${category.rubricId}/categories`,
      },
      {
        name: `${category.name}`,
        href: `${ROUTE_CMS}/rubrics/${category.rubricId}/categories/${category._id}`,
      },
    ],
  };

  return (
    <CmsCategoryLayout category={category} breadcrumbs={breadcrumbs}>
      <Inner testId={'category-attributes'}>
        {(category.attributesGroups || []).map((attributesGroup) => {
          const { name, attributes, _id } = attributesGroup;

          return (
            <div key={`${_id}`} className='mb-12'>
              <Accordion
                isOpen
                title={`${name}`}
                titleRight={
                  <ContentItemControls
                    testId={`${attributesGroup.name}`}
                    justifyContent={'flex-end'}
                    deleteTitle={'Удалить группу атрибутов из категории'}
                    deleteHandler={() => {
                      showModal({
                        variant: CONFIRM_MODAL,
                        props: {
                          testId: 'attributes-group-delete-modal',
                          message: `Вы уверены, что хотите удалить группу атрибутов ${attributesGroup.name} из категории?`,
                          confirm: () => {
                            showLoading();
                            return deleteAttributesGroupFromCategoryMutation({
                              variables: {
                                input: {
                                  categoryId: category._id,
                                  attributesGroupId: attributesGroup._id,
                                },
                              },
                            });
                          },
                        },
                      });
                    }}
                  />
                }
              >
                <div className={`overflow-x-auto mt-4`}>
                  <Table<AttributeInterface>
                    data={attributes}
                    columns={columns(category)}
                    emptyMessage={'Список атрибутов пуст'}
                    testIdKey={'nameString'}
                  />
                </div>
              </Accordion>
            </div>
          );
        })}

        {(category.parents || []).map((parent) => {
          return (
            <React.Fragment key={`${parent._id}`}>
              {(parent.attributesGroups || []).map((attributesGroup) => {
                const { name, attributes, _id } = attributesGroup;

                return (
                  <div key={`${_id}`} className='mb-12'>
                    <Accordion
                      isOpen
                      title={`${name}`}
                      titleRight={
                        <ContentItemControls
                          testId={`${attributesGroup.name}`}
                          justifyContent={'flex-end'}
                          isDeleteDisabled
                          deleteTitle={'Удалить группу атрибутов из категории'}
                          deleteHandler={() => null}
                        />
                      }
                    >
                      <div className={`overflow-x-auto mt-4`}>
                        <Table<AttributeInterface>
                          data={attributes}
                          columns={columns(parent)}
                          emptyMessage={'Список атрибутов пуст'}
                          testIdKey={'nameString'}
                        />
                      </div>
                    </Accordion>
                  </div>
                );
              })}
            </React.Fragment>
          );
        })}

        <FixedButtons>
          <Button
            size={'small'}
            testId={'add-attributes-group'}
            onClick={() => {
              showModal<AddAttributesGroupToRubricModalInterface>({
                variant: ADD_ATTRIBUTES_GROUP_TO_RUBRIC_MODAL,
                props: {
                  testId: 'add-attributes-group-to-rubric-modal',
                  rubricId: `${category._id}`,
                  excludedIds: excludedAttributesGroupsIds.map((_id) => `${_id}`),
                  confirm: (values) => {
                    showLoading();
                    return addAttributesGroupToCategoryMutation({
                      variables: {
                        input: {
                          categoryId: values.rubricId,
                          attributesGroupId: values.attributesGroupId,
                        },
                      },
                    });
                  },
                },
              });
            }}
          >
            Добавить группу атрибутов
          </Button>
        </FixedButtons>
      </Inner>
    </CmsCategoryLayout>
  );
};

interface CategoryAttributesPageInterface
  extends PagePropsInterface,
    CategoryAttributesConsumerInterface {}

const CategoryAttributesPage: NextPage<CategoryAttributesPageInterface> = ({
  pageUrls,
  category,
  excludedAttributesGroupsIds,
}) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <CategoryAttributesConsumer
        category={category}
        excludedAttributesGroupsIds={excludedAttributesGroupsIds}
      />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CategoryAttributesPageInterface>> => {
  const { query } = context;
  const { db } = await getDatabase();
  const categoriesCollection = db.collection<CategoryInterface>(COL_CATEGORIES);
  const attributesCollection = db.collection<AttributeInterface>(COL_ATTRIBUTES);

  const { props } = await getAppInitialData({ context });
  if (!props || !query.categoryId) {
    return {
      notFound: true,
    };
  }

  const attributesStage = [
    {
      $lookup: {
        from: COL_ATTRIBUTES_GROUPS,
        as: 'attributesGroups',
        let: {
          attributesGroupIds: '$attributesGroupIds',
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ['$attributesGroupId', '$$attributesGroupIds'],
              },
            },
          },

          // get attributes
          {
            $lookup: {
              from: COL_ATTRIBUTES,
              as: 'attributes',
              let: {
                attributesGroupId: '$_id',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ['$attributesGroupId', '$$attributesGroupId'],
                    },
                  },
                },
                {
                  $sort: {
                    [`nameI18n.${props.sessionLocale}`]: SORT_ASC,
                    _id: SORT_DESC,
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ];

  const categoriesAggregation = await categoriesCollection
    .aggregate([
      {
        $match: {
          _id: new ObjectId(`${query.categoryId}`),
        },
      },

      // get attributes groups
      ...attributesStage,

      // get category rubric
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
            // get attributes groups
            ...attributesStage,
          ],
        },
      },
      {
        $addFields: {
          rubric: {
            $arrayElemAt: ['$rubric', 0],
          },
        },
      },

      // get category parents
      {
        $lookup: {
          from: COL_CATEGORIES,
          as: 'parents',
          let: {
            currentId: '$_id',
            parentTreeIds: '$parentTreeIds',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $in: ['$_id', '$$parentTreeIds'],
                    },
                    {
                      $ne: ['$_id', '$$currentId'],
                    },
                  ],
                },
              },
            },

            // get attributes groups
            ...attributesStage,
          ],
        },
      },
    ])
    .toArray();
  const initialCategory = categoriesAggregation[0];
  if (!initialCategory) {
    return {
      notFound: true,
    };
  }

  // get excluded attributes groups ids
  const excludedAttributesGroupsIds = (initialCategory.parents || []).reduce(
    (acc: ObjectIdModel[], { attributesGroupIds }) => {
      return [...acc, ...attributesGroupIds];
    },
    [],
  );
  (initialCategory.rubric?.attributesGroupIds || []).forEach((_id) => {
    excludedAttributesGroupsIds.push(_id);
  });

  // siblings
  const siblingsQuery = initialCategory.parentId
    ? {
        _id: { $ne: initialCategory._id },
        parentId: initialCategory.parentId,
        rubricId: initialCategory.rubricId,
      }
    : {
        _id: { $ne: initialCategory._id },
        parentId: null,
        rubricId: initialCategory.rubricId,
      };

  const siblings = await categoriesCollection.find(siblingsQuery).toArray();
  if (siblings.length > 0) {
    const siblingsIds = siblings.map(({ _id }) => _id);
    const siblingsRubricAttributes = await attributesCollection
      .find({
        categoryId: {
          $in: siblingsIds,
        },
      })
      .toArray();
    siblingsRubricAttributes.forEach(({ attributesGroupId }) => {
      if (attributesGroupId) {
        excludedAttributesGroupsIds.push(attributesGroupId);
      }
    });
  }

  const locale = props.sessionLocale;
  const category = castCategoryForUI({
    category: initialCategory,
    locale,
  });

  return {
    props: {
      ...props,
      category: castDbData(category),
      excludedAttributesGroupsIds: castDbData(excludedAttributesGroupsIds),
    },
  };
};

export default CategoryAttributesPage;
