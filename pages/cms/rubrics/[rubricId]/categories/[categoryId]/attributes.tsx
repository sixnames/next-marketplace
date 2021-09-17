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
  COL_RUBRIC_ATTRIBUTES,
  COL_RUBRICS,
} from 'db/collectionNames';
import { ObjectIdModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { CategoryInterface, RubricAttributeInterface } from 'db/uiInterfaces';
import {
  useAddAttributesGroupToCategoryMutation,
  useDeleteAttributesGroupFromCategoryMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsCategoryLayout from 'layout/CmsLayout/CmsCategoryLayout';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { sortByName } from 'lib/optionsUtils';
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

  const columns: TableColumn<RubricAttributeInterface>[] = [
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
      accessor: 'showInCategoryFilter',
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
      accessor: 'category',
      headTitle: 'Категория',
      render: ({ cellData }) => {
        if (cellData && cellData._id !== category._id) {
          return (
            <Link
              href={`${ROUTE_CMS}/rubrics/${category.rubric?._id}/categories/${category._id}/attributes`}
            >
              {cellData.name}
            </Link>
          );
        }
        return null;
      },
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
                    columns={columns}
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

  // child categories
  const childCategories = await categoriesCollection
    .find({
      parentTreeIds: initialCategory._id,
    })
    .toArray();
  const childCategoriesIds = childCategories.map(({ _id }) => _id);

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
    siblingsRubricAttributes.forEach(({ attributesGroupId }) => {
      if (attributesGroupId) {
        excludedAttributesGroupsIds.push(attributesGroupId);
      }
    });
  }

  const rubricAttributes = await rubricAttributesCollection
    .find({
      rubricId: initialCategory.rubricId,
      categoryId: null,
    })
    .toArray();
  const childCategoryAttributes = await rubricAttributesCollection
    .find({
      categoryId: {
        $in: childCategoriesIds,
      },
    })
    .toArray();
  rubricAttributes.forEach(({ attributesGroupId }) => {
    if (attributesGroupId) {
      excludedAttributesGroupsIds.push(attributesGroupId);
    }
  });
  childCategoryAttributes.forEach(({ attributesGroupId }) => {
    if (attributesGroupId) {
      excludedAttributesGroupsIds.push(attributesGroupId);
    }
  });

  const { sessionLocale } = props;

  const castedAttributesGroups = (initialCategory.attributesGroups || []).map((attributesGroup) => {
    return {
      ...attributesGroup,
      name: getFieldStringLocale(attributesGroup.nameI18n, sessionLocale),
      attributes: (attributesGroup.attributes || []).map((attribute) => {
        return {
          ...attribute,
          metric: attribute.metric
            ? {
                ...attribute.metric,
                name: getFieldStringLocale(attribute.metric.nameI18n, sessionLocale),
              }
            : null,
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
  });

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
    attributesGroups: sortByName(castedAttributesGroups),
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
