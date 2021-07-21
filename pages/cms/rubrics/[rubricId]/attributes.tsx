import Accordion from 'components/Accordion';
import Button from 'components/Button';
import FixedButtons from 'components/FixedButtons';
import ContentItemControls from 'components/ContentItemControls/ContentItemControls';
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
import { COL_ATTRIBUTES_GROUPS, COL_RUBRIC_ATTRIBUTES, COL_RUBRICS } from 'db/collectionNames';
import { RubricModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { RubricAttributeInterface, RubricInterface } from 'db/uiInterfaces';
import {
  useAddAttributesGroupToRubricMutation,
  useDeleteAttributesGroupFromRubricMutation,
  useToggleAttributeInProductAttributesMutation,
  useToggleAttributeInRubricCatalogueMutation,
  useToggleAttributeInRubricNavMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import CmsRubricLayout from 'layout/CmsLayout/CmsRubricLayout';
import { getFieldStringLocale } from 'lib/i18n';
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

  const [toggleAttributeInRubricCatalogueMutation] = useToggleAttributeInRubricCatalogueMutation({
    onCompleted: (data) => onCompleteCallback(data.toggleAttributeInRubricCatalogue),
    onError: onErrorCallback,
  });

  const [toggleAttributeInRubricNavMutation] = useToggleAttributeInRubricNavMutation({
    onCompleted: (data) => onCompleteCallback(data.toggleAttributeInRubricNav),
    onError: onErrorCallback,
  });

  const [toggleAttributeInProductAttributesMutation] =
    useToggleAttributeInProductAttributesMutation({
      onCompleted: (data) => onCompleteCallback(data.toggleAttributeInProductAttributes),
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
      accessor: '_id',
      headTitle: 'Показывать в фильтре',
      render: ({ cellData, dataItem }) => {
        const isDisabled =
          dataItem.variant === ATTRIBUTE_VARIANT_NUMBER ||
          dataItem.variant === ATTRIBUTE_VARIANT_STRING;
        return (
          <Checkbox
            testId={`${dataItem.name}-filter`}
            disabled={isDisabled}
            checked={dataItem.showInCatalogueFilter}
            value={cellData}
            name={'showInCatalogueFilter'}
            onChange={() => {
              showLoading();
              toggleAttributeInRubricCatalogueMutation({
                variables: {
                  input: {
                    attributeId: cellData,
                    rubricId: rubric._id,
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
          dataItem.variant === ATTRIBUTE_VARIANT_STRING;
        return (
          <Checkbox
            testId={`${dataItem.name}-nav`}
            disabled={isDisabled}
            checked={dataItem.showInCatalogueNav}
            value={cellData}
            name={'showInCatalogueNav'}
            onChange={() => {
              showLoading();
              toggleAttributeInRubricNavMutation({
                variables: {
                  input: {
                    attributeId: cellData,
                    rubricId: rubric._id,
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
                    rubricId: rubric._id,
                  },
                },
              }).catch(console.log);
            }}
          />
        );
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
          return (
            <div key={`${_id}`} className='mb-12'>
              <Accordion
                isOpen
                title={`${name}`}
                titleRight={
                  <ContentItemControls
                    justifyContent={'flex-end'}
                    deleteTitle={'Удалить группу атрибутов из рубрики'}
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
                    testId={`${attributesGroup.name}`}
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
                  excludedIds: rubric.attributesGroupsIds.map((_id) => `${_id}`),
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
          from: COL_ATTRIBUTES_GROUPS,
          as: 'attributesGroups',
          let: { attributesGroupsIds: '$attributesGroupsIds', rubricId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ['$_id', '$$attributesGroupsIds'],
                },
              },
            },
            {
              $sort: {
                [`nameI18n.${props.sessionLocale}`]: SORT_ASC,
                _id: SORT_DESC,
              },
            },
            {
              $lookup: {
                from: COL_RUBRIC_ATTRIBUTES,
                as: 'attributes',
                let: { attributesIds: '$attributesIds' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $in: ['$attributeId', '$$attributesIds'] },
                          { $eq: ['$$rubricId', '$rubricId'] },
                        ],
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
    ])
    .toArray();
  const initialRubric = initialRubrics[0];
  if (!initialRubric) {
    return {
      notFound: true,
    };
  }

  const { sessionLocale } = props;
  const rawRubric: RubricInterface = {
    ...initialRubric,
    name: getFieldStringLocale(initialRubric.nameI18n, sessionLocale),
    attributes: [],
    attributesGroups: (initialRubric.attributesGroups || []).map((attributesGroup) => {
      return {
        ...attributesGroup,
        name: getFieldStringLocale(attributesGroup.nameI18n, sessionLocale),
        attributes: (attributesGroup.attributes || []).map((attribute) => {
          return {
            ...attribute,
            name: getFieldStringLocale(attribute.nameI18n, sessionLocale),
          };
        }),
      };
    }),
  };

  return {
    props: {
      ...props,
      rubric: castDbData(rawRubric),
    },
  };
};

export default RubricAttributesPage;
