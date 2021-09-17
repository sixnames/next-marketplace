import CheckBox from 'components/FormElements/Checkbox/Checkbox';
import Accordion from 'components/Accordion';
import Button from 'components/Button';
import FixedButtons from 'components/FixedButtons';
import ContentItemControls from 'components/ContentItemControls';
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
import { RubricModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { RubricAttributeInterface, RubricInterface } from 'db/uiInterfaces';
import {
  useAddAttributesGroupToRubricMutation,
  useDeleteAttributesGroupFromRubricMutation,
  useUpdateAttributeInRubricMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import CmsRubricLayout from 'layout/CmsLayout/CmsRubricLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { sortByName } from 'lib/optionsUtils';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';

interface RubricAttributesConsumerInterface {
  rubric: RubricInterface;
}

const RubricAttributesConsumer: React.FC<RubricAttributesConsumerInterface> = ({ rubric }) => {
  const { locale } = useLocaleContext();
  const { showModal, onCompleteCallback, onErrorCallback, showLoading } = useMutationCallbacks({
    withModal: true,
    reload: true,
  });

  const [deleteAttributesGroupFromRubricMutation] = useDeleteAttributesGroupFromRubricMutation({
    onCompleted: (data) => onCompleteCallback(data.deleteAttributesGroupFromRubric),
    onError: onErrorCallback,
  });

  const [addAttributesGroupToRubricMutation] = useAddAttributesGroupToRubricMutation({
    onCompleted: (data) => onCompleteCallback(data.addAttributesGroupToRubric),
    onError: onErrorCallback,
  });

  const [updateAttributeInRubricMutation] = useUpdateAttributeInRubricMutation({
    onCompleted: (data) => onCompleteCallback(data.updateAttributeInRubric),
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
      accessor: 'showInRubricFilter',
      headTitle: 'Показывать в фильтре рубрики',
      render: ({ cellData, dataItem }) => {
        return (
          <CheckBox
            value={cellData}
            name={dataItem.slug}
            checked={cellData}
            onChange={(e: any) => {
              updateAttributeInRubricMutation({
                variables: {
                  input: {
                    rubricAttributeId: dataItem._id,
                    rubricId: rubric._id,
                    showInRubricFilter: Boolean(e?.target?.checked),
                  },
                },
              }).catch(console.log);
            }}
          />
        );
      },
    },
    {
      accessor: 'category',
      headTitle: 'Категория',
      render: ({ cellData }) => {
        if (cellData) {
          return (
            <Link
              href={`${ROUTE_CMS}/rubrics/${rubric?._id}/categories/${cellData._id}/attributes`}
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
        name: `${rubric.name}`,
        href: `${ROUTE_CMS}/rubrics/${rubric._id}`,
      },
    ],
  };

  return (
    <CmsRubricLayout rubric={rubric} breadcrumbs={breadcrumbs}>
      <Inner testId={'rubric-attributes'}>
        {(rubric.attributesGroups || []).map((attributesGroup) => {
          const { name, attributes, _id } = attributesGroup;
          const isAttributeDisabled = (attributes || []).some((attribute) => {
            return attribute.categoryId;
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
                    deleteTitle={'Удалить группу атрибутов из рубрики'}
                    isDeleteDisabled={isAttributeDisabled}
                    deleteHandler={() => {
                      showModal({
                        variant: CONFIRM_MODAL,
                        props: {
                          testId: 'attributes-group-delete-modal',
                          message: `Вы уверены, что хотите удалить группу атрибутов ${attributesGroup.name} из рубрики?`,
                          confirm: () => {
                            showLoading();
                            return deleteAttributesGroupFromRubricMutation({
                              variables: {
                                input: {
                                  rubricId: rubric._id,
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
                  rubricId: `${rubric._id}`,
                  excludedIds: (rubric.attributesGroups || []).map(
                    (attributesGroup) => `${attributesGroup._id}`,
                  ),
                  confirm: (values) => {
                    showLoading();
                    return addAttributesGroupToRubricMutation({
                      variables: {
                        input: values,
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
    </CmsRubricLayout>
  );
};

interface RubricAttributesPageInterface
  extends PagePropsInterface,
    RubricAttributesConsumerInterface {}

const RubricAttributesPage: NextPage<RubricAttributesPageInterface> = ({ pageUrls, rubric }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <RubricAttributesConsumer rubric={rubric} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<RubricAttributesPageInterface>> => {
  const { query } = context;
  const { db } = await getDatabase();
  const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);

  const { props } = await getAppInitialData({ context });
  if (!props || !query.rubricId) {
    return {
      notFound: true,
    };
  }

  const initialRubrics = await rubricsCollection
    .aggregate<RubricInterface>([
      {
        $match: {
          _id: new ObjectId(`${query.rubricId}`),
        },
      },
      {
        $project: {
          priorities: false,
          views: false,
        },
      },
      {
        $lookup: {
          from: COL_RUBRIC_ATTRIBUTES,
          as: 'attributesGroups',
          let: {
            rubricId: '$_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$$rubricId', '$rubricId'] }],
                },
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
  const initialRubric = initialRubrics[0];
  if (!initialRubric) {
    return {
      notFound: true,
    };
  }

  const { sessionLocale } = props;
  const attributesGroups = (initialRubric.attributesGroups || []).map((attributesGroup) => {
    return {
      ...attributesGroup,
      name: getFieldStringLocale(attributesGroup.nameI18n, sessionLocale),
      attributes: (attributesGroup.attributes || []).map((attribute) => {
        return {
          ...attribute,
          name: getFieldStringLocale(attribute.nameI18n, sessionLocale),
          metric: attribute.metric
            ? {
                ...attribute.metric,
                name: getFieldStringLocale(attribute.metric.nameI18n, sessionLocale),
              }
            : null,
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

  const rawRubric: RubricInterface = {
    ...initialRubric,
    name: getFieldStringLocale(initialRubric.nameI18n, sessionLocale),
    attributes: [],
    attributesGroups: sortByName(attributesGroups),
  };

  return {
    props: {
      ...props,
      rubric: castDbData(rawRubric),
    },
  };
};

export default RubricAttributesPage;
