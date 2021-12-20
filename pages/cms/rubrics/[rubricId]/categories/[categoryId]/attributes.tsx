import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';
import ContentItemControls from '../../../../../../components/button/ContentItemControls';
import FixedButtons from '../../../../../../components/button/FixedButtons';
import WpButton from '../../../../../../components/button/WpButton';
import WpCheckbox from '../../../../../../components/FormElements/Checkbox/WpCheckbox';
import Inner from '../../../../../../components/Inner';
import WpLink from '../../../../../../components/Link/WpLink';
import { AddAttributesGroupToRubricModalInterface } from '../../../../../../components/Modal/AddAttributesGroupToRubricModal';
import WpAccordion from '../../../../../../components/WpAccordion';
import WpTable, { WpTableColumn } from '../../../../../../components/WpTable';
import { ROUTE_CMS } from '../../../../../../config/common';
import { getConstantTranslation } from '../../../../../../config/constantTranslations';
import {
  ADD_ATTRIBUTES_GROUP_TO_RUBRIC_MODAL,
  CONFIRM_MODAL,
} from '../../../../../../config/modalVariants';
import { useLocaleContext } from '../../../../../../context/localeContext';
import { COL_ATTRIBUTES, COL_CATEGORIES, COL_RUBRICS } from '../../../../../../db/collectionNames';
import { castCategoryForUI } from '../../../../../../db/dao/category/castCategoryForUI';
import { rubricAttributeGroupsPipeline } from '../../../../../../db/dao/constantPipelines';
import { ObjectIdModel } from '../../../../../../db/dbModels';
import { getDatabase } from '../../../../../../db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  AttributeInterface,
  CategoryInterface,
} from '../../../../../../db/uiInterfaces';
import {
  useAddAttributesGroupToCategoryMutation,
  useDeleteAttributesGroupFromCategoryMutation,
} from '../../../../../../generated/apolloComponents';
import useMutationCallbacks from '../../../../../../hooks/useMutationCallbacks';
import CmsCategoryLayout from '../../../../../../layout/cms/CmsCategoryLayout';
import ConsoleLayout from '../../../../../../layout/cms/ConsoleLayout';
import {
  castDbData,
  getAppInitialData,
  GetAppInitialDataPropsInterface,
} from '../../../../../../lib/ssrUtils';

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

  const columns = (columnCategory?: CategoryInterface): WpTableColumn<AttributeInterface>[] => [
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
        const checked = category.rubric?.filterVisibleAttributeIds.includes(dataItem._id);

        return (
          <WpCheckbox
            disabled
            value={cellData}
            name={dataItem.slug}
            checked={checked}
            onChange={() => undefined}
          />
        );
      },
    },
    {
      headTitle: 'Категория',
      render: () => {
        if (columnCategory && columnCategory._id !== category._id) {
          return (
            <WpLink
              href={`${ROUTE_CMS}/rubrics/${columnCategory.rubric?._id}/categories/${columnCategory._id}/attributes`}
            >
              {columnCategory.name}
            </WpLink>
          );
        }
        if (!columnCategory) {
          return 'На уровне рубрики';
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

          return (
            <div key={`${_id}`} className='mb-12'>
              <WpAccordion
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
                  <WpTable<AttributeInterface>
                    data={attributes}
                    columns={columns(category)}
                    emptyMessage={'Список атрибутов пуст'}
                    testIdKey={'nameString'}
                  />
                </div>
              </WpAccordion>
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
                    <WpAccordion
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
                        <WpTable<AttributeInterface>
                          data={attributes}
                          columns={columns(parent)}
                          emptyMessage={'Список атрибутов пуст'}
                          testIdKey={'nameString'}
                        />
                      </div>
                    </WpAccordion>
                  </div>
                );
              })}
            </React.Fragment>
          );
        })}

        {(category.rubric?.attributesGroups || []).map((attributesGroup) => {
          const { name, attributes, _id } = attributesGroup;

          return (
            <div key={`${_id}`} className='mb-12'>
              <WpAccordion
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
                  <WpTable<AttributeInterface>
                    data={attributes}
                    columns={columns()}
                    emptyMessage={'Список атрибутов пуст'}
                    testIdKey={'nameString'}
                  />
                </div>
              </WpAccordion>
            </div>
          );
        })}

        <FixedButtons>
          <WpButton
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
          </WpButton>
        </FixedButtons>
      </Inner>
    </CmsCategoryLayout>
  );
};

interface CategoryAttributesPageInterface
  extends GetAppInitialDataPropsInterface,
    CategoryAttributesConsumerInterface {}

const CategoryAttributesPage: NextPage<CategoryAttributesPageInterface> = ({
  layoutProps,
  ...props
}) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <CategoryAttributesConsumer {...props} />
    </ConsoleLayout>
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

  const categoriesAggregation = await categoriesCollection
    .aggregate<CategoryInterface>([
      {
        $match: {
          _id: new ObjectId(`${query.categoryId}`),
        },
      },

      // get attributes groups
      ...rubricAttributeGroupsPipeline,

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
            ...rubricAttributeGroupsPipeline,
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
            ...rubricAttributeGroupsPipeline,
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
