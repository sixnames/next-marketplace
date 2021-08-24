import Accordion from 'components/Accordion';
import Button from 'components/Button';
import FixedButtons from 'components/FixedButtons';
import ContentItemControls from 'components/ContentItemControls';
import Checkbox from 'components/FormElements/Checkbox/Checkbox';
import Inner from 'components/Inner';
import { AddAttributesGroupToRubricModalInterface } from 'components/Modal/AddAttributesGroupToRubricModal';
import Table, { TableColumn } from 'components/Table';
import {
  ATTRIBUTE_VARIANT_NUMBER,
  ATTRIBUTE_VARIANT_STRING,
  ROUTE_CMS,
  SORT_ASC,
  SORT_DESC,
} from 'config/common';
import { getConstantTranslation } from 'config/constantTranslations';
import { ADD_ATTRIBUTES_GROUP_TO_RUBRIC_MODAL, CONFIRM_MODAL } from 'config/modalVariants';
import { useLocaleContext } from 'context/localeContext';
import {
  COL_ATTRIBUTES_GROUPS,
  COL_CATEGORIES,
  COL_RUBRIC_ATTRIBUTES,
  COL_RUBRICS,
} from 'db/collectionNames';
import { ObjectIdModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { CategoryInterface, RubricAttributeInterface } from 'db/uiInterfaces';
import {
  useAddAttributesGroupToCategoryMutation,
  useDeleteAttributesGroupFromCategoryMutation,
  useToggleAttributeInCategoryCatalogueMutation,
  useToggleAttributeInCategoryNavMutation,
  useToggleAttributeInProductAttributesMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsCategoryLayout from 'layout/CmsLayout/CmsCategoryLayout';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
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

  const [toggleAttributeInCategoryCatalogueMutation] =
    useToggleAttributeInCategoryCatalogueMutation({
      onCompleted: (data) => onCompleteCallback(data.toggleAttributeInCategoryCatalogue),
      onError: onErrorCallback,
    });

  const [toggleAttributeInCategoryNavMutation] = useToggleAttributeInCategoryNavMutation({
    onCompleted: (data) => onCompleteCallback(data.toggleAttributeInCategoryNav),
    onError: onErrorCallback,
  });

  const [toggleAttributeInProductAttributesMutation] =
    useToggleAttributeInProductAttributesMutation({
      onCompleted: (data) => onCompleteCallback(data.toggleAttributeInProductAttributes),
      onError: onErrorCallback,
    });

  const columns = (isAttributeDisabled: boolean): TableColumn<RubricAttributeInterface>[] => [
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
      accessor: '_id',
      headTitle: 'Показывать в фильтре',
      render: ({ cellData, dataItem }) => {
        const isDisabled =
          dataItem.variant === ATTRIBUTE_VARIANT_NUMBER ||
          dataItem.variant === ATTRIBUTE_VARIANT_STRING ||
          isAttributeDisabled;
        return (
          <Checkbox
            testId={`${dataItem.name}-filter`}
            disabled={isDisabled}
            checked={dataItem.showInCatalogueFilter}
            value={cellData}
            name={'showInCatalogueFilter'}
            onChange={() => {
              showLoading();
              toggleAttributeInCategoryCatalogueMutation({
                variables: {
                  input: {
                    attributeId: cellData,
                    categoryId: category._id,
                  },
                },
              }).catch(console.log);
            }}
          />
        );
      },
    },
    {
      accessor: '_id',
      headTitle: 'Показывать в навигации',
      render: ({ cellData, dataItem }) => {
        const isDisabled =
          dataItem.variant === ATTRIBUTE_VARIANT_NUMBER ||
          dataItem.variant === ATTRIBUTE_VARIANT_STRING ||
          isAttributeDisabled;
        return (
          <Checkbox
            testId={`${dataItem.name}-nav`}
            disabled={isDisabled}
            checked={dataItem.showInCatalogueNav}
            value={cellData}
            name={'showInCatalogueNav'}
            onChange={() => {
              showLoading();
              toggleAttributeInCategoryNavMutation({
                variables: {
                  input: {
                    attributeId: cellData,
                    categoryId: category._id,
                  },
                },
              }).catch(console.log);
            }}
          />
        );
      },
    },
    {
      accessor: '_id',
      headTitle: 'Показывать в настройках товара',
      render: ({ cellData, dataItem }) => {
        return (
          <Checkbox
            disabled={isAttributeDisabled}
            testId={`${dataItem.name}-nav`}
            checked={dataItem.showInProductAttributes}
            value={cellData}
            name={'showInCatalogueNav'}
            onChange={() => {
              showLoading();
              toggleAttributeInProductAttributesMutation({
                variables: {
                  input: {
                    attributeId: cellData,
                    rubricId: category._id,
                  },
                },
              }).catch(console.log);
            }}
          />
        );
      },
    },
    {
      accessor: 'category.name',
      headTitle: 'Категория',
      render: ({ cellData }) => cellData || 'На уровне рубрики',
    },
  ];

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
          const isAttributeDisabled = (attributes || []).some((attribute) => {
            return attribute.categoryId !== category._id;
          });

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
                    isDeleteDisabled={isAttributeDisabled}
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
                  <Table<RubricAttributeInterface>
                    data={attributes}
                    columns={columns(isAttributeDisabled)}
                    emptyMessage={'Список атрибутов пуст'}
                    testIdKey={'nameString'}
                  />
                </div>
              </Accordion>
            </div>
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
  const rubricAttributesCollection = db.collection<RubricAttributeInterface>(COL_RUBRIC_ATTRIBUTES);

  const { props } = await getAppInitialData({ context });
  if (!props || !query.categoryId) {
    return {
      notFound: true,
    };
  }

  const categoriesAggregation = await categoriesCollection
    .aggregate([
      {
        $match: {
          _id: new ObjectId(`${query.categoryId}`),
        },
      },
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

      // get category attributes
      {
        $lookup: {
          from: COL_RUBRIC_ATTRIBUTES,
          as: 'attributesGroups',
          let: {
            categoryId: '$_id',
            parentTreeIds: '$parentTreeIds',
            rubricId: '$rubricId',
          },
          pipeline: [
            {
              $match: {
                $or: [
                  {
                    $expr: {
                      $in: ['$categoryId', '$$parentTreeIds'],
                    },
                  },
                  {
                    $expr: {
                      $eq: ['$categoryId', '$$categoryId'],
                    },
                  },
                  {
                    categoryId: null,
                    $expr: {
                      $eq: ['$rubricId', '$$rubricId'],
                    },
                  },
                ],
              },
            },
            {
              $sort: {
                [`nameI18n.${props.sessionLocale}`]: SORT_ASC,
                _id: SORT_DESC,
              },
            },

            // get category
            {
              $lookup: {
                from: COL_CATEGORIES,
                as: 'category',
                let: {
                  categoryId: '$categoryId',
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$_id', '$$categoryId'],
                      },
                    },
                  },
                ],
              },
            },

            // get attributes group
            {
              $lookup: {
                from: COL_ATTRIBUTES_GROUPS,
                as: 'attributesGroup',
                let: {
                  attributesGroupId: '$attributesGroupId',
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$_id', '$$attributesGroupId'],
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
            {
              $addFields: {
                attributesGroup: {
                  $arrayElemAt: ['$attributesGroup', 0],
                },
                category: {
                  $arrayElemAt: ['$category', 0],
                },
              },
            },
            {
              $group: {
                _id: '$attributesGroupId',
                nameI18n: {
                  $first: '$attributesGroup.nameI18n',
                },
                attributes: {
                  $push: '$$ROOT',
                },
              },
            },
            {
              $project: {
                'attributes.attributesGroup': false,
              },
            },
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
  const excludedAttributesGroupsIds: ObjectIdModel[] = (initialCategory.attributesGroups || []).map(
    ({ _id }) => {
      return _id;
    },
  );

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
    const siblingsRubricAttributes = await rubricAttributesCollection
      .find({
        categoryId: {
          $in: siblingsIds,
        },
      })
      .toArray();
    const rubricAttributes = await rubricAttributesCollection
      .find({
        rubricId: initialCategory.rubricId,
        categoryId: null,
      })
      .toArray();

    rubricAttributes.forEach(({ attributesGroupId }) => {
      if (attributesGroupId) {
        excludedAttributesGroupsIds.push(attributesGroupId);
      }
    });

    siblingsRubricAttributes.forEach(({ attributesGroupId }) => {
      if (attributesGroupId) {
        excludedAttributesGroupsIds.push(attributesGroupId);
      }
    });
  }

  const { sessionLocale } = props;
  const category: CategoryInterface = {
    ...initialCategory,
    name: getFieldStringLocale(initialCategory.nameI18n, sessionLocale),
    attributes: [],
    rubric: initialCategory.rubric
      ? {
          ...initialCategory.rubric,
          name: getFieldStringLocale(initialCategory.rubric.nameI18n, sessionLocale),
        }
      : null,
    attributesGroups: (initialCategory.attributesGroups || []).map((attributesGroup) => {
      return {
        ...attributesGroup,
        name: getFieldStringLocale(attributesGroup.nameI18n, sessionLocale),
        attributes: (attributesGroup.attributes || []).map((attribute) => {
          return {
            ...attribute,
            name: getFieldStringLocale(attribute.nameI18n, sessionLocale),
            category: attribute.category
              ? {
                  ...attribute.category,
                  name: getFieldStringLocale(attribute.category.nameI18n, sessionLocale),
                }
              : null,
          };
        }),
      };
    }),
  };

  return {
    props: {
      ...props,
      category: castDbData(category),
      excludedAttributesGroupsIds: castDbData(excludedAttributesGroupsIds),
    },
  };
};

export default CategoryAttributesPage;
