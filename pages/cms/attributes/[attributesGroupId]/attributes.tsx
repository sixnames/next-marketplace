import FixedButtons from 'components/button/FixedButtons';
import ContentItemControls from 'components/button/ContentItemControls';
import { AddAttributeToGroupModalInterface } from 'components/Modal/AttributeInGroupModal';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import { MoveAttributeModalInterface } from 'components/Modal/MoveAttributeModal';
import Table, { TableColumn } from 'components/Table';
import { DEFAULT_LOCALE, ROUTE_CMS, SORT_ASC } from 'config/common';
import { getBooleanTranslation, getConstantTranslation } from 'config/constantTranslations';
import {
  ATTRIBUTE_IN_GROUP_MODAL,
  CONFIRM_MODAL,
  MOVE_ATTRIBUTE_MODAL,
} from 'config/modalVariants';
import { useLocaleContext } from 'context/localeContext';
import {
  UpdateAttributeInGroupInput,
  useAddAttributeToGroupMutation,
  useDeleteAttributeFromGroupMutation,
  useUpdateAttributeInGroupMutation,
} from 'generated/apolloComponents';
import AppSubNav from 'layout/AppSubNav';
import { ObjectId } from 'mongodb';
import * as React from 'react';
import Button from 'components/button/Button';
import Inner from 'components/Inner';
import Title from 'components/Title';
import { COL_ATTRIBUTES, COL_ATTRIBUTES_GROUPS, COL_OPTIONS_GROUPS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { AttributeInterface, AttributesGroupInterface } from 'db/uiInterfaces';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import AppContentWrapper, { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import { getFieldStringLocale } from 'lib/i18n';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import Head from 'next/head';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { ClientNavItemInterface } from 'types/clientTypes';

const pageTitle = `Группы атрибутов`;

interface AttributesConsumerInterface {
  attributesGroup: AttributesGroupInterface;
}

const AttributesConsumer: React.FC<AttributesConsumerInterface> = ({ attributesGroup }) => {
  const { locale } = useLocaleContext();
  const { onCompleteCallback, onErrorCallback, showLoading, showModal } = useMutationCallbacks({
    reload: true,
    withModal: true,
  });

  const [deleteAttributeFromGroupMutation] = useDeleteAttributeFromGroupMutation({
    onCompleted: (data) => onCompleteCallback(data.deleteAttributeFromGroup),
    onError: onErrorCallback,
  });

  const [updateAttributeInGroupMutation] = useUpdateAttributeInGroupMutation({
    onCompleted: (data) => onCompleteCallback(data.updateAttributeInGroup),
    onError: onErrorCallback,
  });

  const [addAttributeToGroupMutation] = useAddAttributeToGroupMutation({
    onCompleted: (data) => onCompleteCallback(data.addAttributeToGroup),
    onError: onErrorCallback,
  });

  function updateAttributeHandler(attribute: AttributeInterface) {
    showModal<AddAttributeToGroupModalInterface>({
      variant: ATTRIBUTE_IN_GROUP_MODAL,
      props: {
        attribute,
        attributesGroupId: `${attributesGroup._id}`,
        confirm: (
          input: Omit<UpdateAttributeInGroupInput, 'attributesGroupId' | 'attributeId'>,
        ) => {
          showLoading();
          updateAttributeInGroupMutation({
            variables: {
              input: {
                attributesGroupId: attributesGroup._id,
                attributeId: attribute._id,
                ...input,
                metricId: input.metricId || null,
              },
            },
          }).catch((e) => console.log(e));
        },
      },
    });
  }

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Атрибуты`,
    config: [
      {
        name: 'Группы атрибутов',
        href: `${ROUTE_CMS}/attributes`,
      },
      {
        name: `${attributesGroup.name}`,
        href: `${ROUTE_CMS}/attributes/${attributesGroup._id}`,
      },
    ],
  };

  const navConfig = React.useMemo<ClientNavItemInterface[]>(() => {
    return [
      {
        name: 'Атрибуты',
        testId: 'sub-nav-attributes',
        path: `${ROUTE_CMS}/attributes/${attributesGroup._id}/attributes`,
        exact: true,
      },
      {
        name: 'Детали',
        testId: 'sub-nav-details',
        path: `${ROUTE_CMS}/attributes/${attributesGroup._id}`,
        exact: true,
      },
    ];
  }, [attributesGroup._id]);

  const columns: TableColumn<AttributeInterface>[] = [
    {
      accessor: 'name',
      headTitle: 'Название',
      render: ({ cellData }) => {
        return (
          <div data-cy={`attribute-${cellData}`} className='whitespace-nowrap'>
            {cellData}
          </div>
        );
      },
    },
    {
      accessor: 'variant',
      headTitle: 'Тип',
      render: ({ cellData }) =>
        getConstantTranslation(`selectsOptions.attributeVariants.${cellData}.${locale}`),
    },
    {
      accessor: 'viewVariant',
      headTitle: 'Тип отображения',
      render: ({ cellData }) =>
        getConstantTranslation(`selectsOptions.attributeView.${cellData}.${locale}`),
    },
    {
      accessor: 'optionsGroup',
      headTitle: 'Опции',
      render: ({ cellData }) => cellData?.name || null,
    },
    {
      accessor: 'metric',
      headTitle: 'Ед. измерения',
      render: ({ cellData }) => cellData?.name || null,
    },
    {
      accessor: 'positioningInTitle',
      headTitle: 'Поз-ие в заголове',
      render: ({ cellData }) => {
        if (!cellData) {
          return null;
        }
        return getConstantTranslation(
          `selectsOptions.attributePositioning.${cellData[locale]}.${locale}`,
        );
      },
    },
    {
      accessor: 'capitalise',
      headTitle: 'С заглавной буквы в заголовке',
      render: ({ cellData }) => {
        return getBooleanTranslation({
          value: cellData,
          locale,
        });
      },
    },
    {
      accessor: 'notShowAsAlphabet',
      headTitle: 'Не показывать опции атрибута сгруппированными по алфавиту',
      render: ({ cellData }) => {
        return getBooleanTranslation({
          value: cellData,
          locale,
        });
      },
    },
    {
      accessor: 'showInCard',
      headTitle: 'Показывать в карточке товара',
      render: ({ cellData }) => {
        return getBooleanTranslation({
          value: cellData,
          locale,
        });
      },
    },
    {
      accessor: 'showAsBreadcrumb',
      headTitle: 'Показывать в крошках карточки товара',
      render: ({ cellData }) => {
        return getBooleanTranslation({
          value: cellData,
          locale,
        });
      },
    },
    {
      accessor: 'showAsCatalogueBreadcrumb',
      headTitle: 'Показывать в крошках каталога',
      render: ({ cellData }) => {
        return getBooleanTranslation({
          value: cellData,
          locale,
        });
      },
    },
    {
      accessor: 'showInSnippet',
      headTitle: 'Показывать в сниппете товара',
      render: ({ cellData }) => {
        return getBooleanTranslation({
          value: cellData,
          locale,
        });
      },
    },
    {
      accessor: 'showNameInTitle',
      headTitle: 'Показывать название атрибута в заголовке каталога',
      render: ({ cellData }) => {
        return getBooleanTranslation({
          value: cellData,
          locale,
        });
      },
    },
    {
      accessor: 'showNameInSelectedAttributes',
      headTitle: 'Показывать название атрибута в выбраных фильтрах каталога',
      render: ({ cellData }) => {
        return getBooleanTranslation({
          value: cellData,
          locale,
        });
      },
    },
    {
      accessor: 'showNameInSnippetTitle',
      headTitle: 'Показывать название атрибута в заголовке сниппета',
      render: ({ cellData }) => {
        return getBooleanTranslation({
          value: cellData,
          locale,
        });
      },
    },
    {
      render: ({ dataItem }) => {
        const { name } = dataItem;
        return (
          <ContentItemControls
            testId={`${name}-attribute`}
            justifyContent={'flex-end'}
            updateTitle={'Редактировать атрибут'}
            updateHandler={() => updateAttributeHandler(dataItem)}
            moveTitle={'Переместить атрибут'}
            moveHandler={() => {
              showModal<MoveAttributeModalInterface>({
                variant: MOVE_ATTRIBUTE_MODAL,
                props: {
                  attributeId: `${dataItem._id}`,
                  oldAttributesGroupId: `${dataItem.attributesGroupId}`,
                },
              });
            }}
            deleteTitle={'Удалить атрибут'}
            deleteHandler={() => {
              showModal<ConfirmModalInterface>({
                variant: CONFIRM_MODAL,
                props: {
                  testId: 'delete-attribute-modal',
                  message: `Вы уверенны, что хотите удалить атрибут ${name}?`,
                  confirm: () => {
                    showLoading();
                    return deleteAttributeFromGroupMutation({
                      variables: {
                        input: {
                          attributesGroupId: attributesGroup._id,
                          attributeId: dataItem._id,
                        },
                      },
                    });
                  },
                },
              });
            }}
          />
        );
      },
    },
  ];

  return (
    <AppContentWrapper testId={'attributes-list'} breadcrumbs={breadcrumbs}>
      <Head>
        <title>{attributesGroup.name}</title>
      </Head>
      <Inner lowBottom>
        <Title testId={'attributes-group-title'}>{attributesGroup.name}</Title>
      </Inner>
      <AppSubNav navConfig={navConfig} />

      <Inner>
        <div className='overflow-x-auto'>
          <Table<AttributeInterface>
            testIdKey={'name'}
            columns={columns}
            data={attributesGroup.attributes || []}
            onRowDoubleClick={(dataItem) => updateAttributeHandler(dataItem)}
          />
        </div>

        <FixedButtons>
          <Button
            testId={`create-attribute`}
            size={'small'}
            onClick={() => {
              showModal<AddAttributeToGroupModalInterface>({
                variant: ATTRIBUTE_IN_GROUP_MODAL,
                props: {
                  attributesGroupId: `${attributesGroup._id}`,
                  confirm: (input) => {
                    showLoading();
                    return addAttributeToGroupMutation({
                      variables: {
                        input: {
                          attributesGroupId: `${attributesGroup._id}`,
                          ...input,
                        },
                      },
                    });
                  },
                },
              });
            }}
          >
            Добавить атрибут
          </Button>
        </FixedButtons>
      </Inner>
    </AppContentWrapper>
  );
};

interface AttributesPageInterface
  extends GetAppInitialDataPropsInterface,
    AttributesConsumerInterface {}

const Attributes: NextPage<AttributesPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout title={pageTitle} {...layoutProps}>
      <AttributesConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<AttributesPageInterface>> => {
  const { query } = context;
  const { props } = await getAppInitialData({ context });

  if (!props || !query.attributesGroupId) {
    return {
      notFound: true,
    };
  }

  const { db } = await getDatabase();
  const attributesGroupsCollection = db.collection<AttributesGroupInterface>(COL_ATTRIBUTES_GROUPS);

  const attributesGroupAggregationResult = await attributesGroupsCollection
    .aggregate<AttributesGroupInterface>([
      {
        $match: {
          _id: new ObjectId(`${query.attributesGroupId}`),
        },
      },
      {
        $lookup: {
          from: COL_ATTRIBUTES,
          as: 'attributes',
          let: { attributesGroupId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$attributesGroupId', '$$attributesGroupId'],
                },
              },
            },
            {
              $lookup: {
                from: COL_OPTIONS_GROUPS,
                as: 'optionsGroup',
                let: { optionsGroupId: '$optionsGroupId' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$_id', '$$optionsGroupId'],
                      },
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                optionsGroup: {
                  $arrayElemAt: ['$optionsGroup', 0],
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

  const attributesGroup = attributesGroupAggregationResult[0];

  if (!attributesGroup) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...props,
      attributesGroup: castDbData({
        ...attributesGroup,
        name: getFieldStringLocale(attributesGroup.nameI18n, props.sessionLocale),
        attributes: (attributesGroup.attributes || []).map((attribute) => {
          return {
            ...attribute,
            optionsGroup: attribute.optionsGroup
              ? {
                  ...attribute.optionsGroup,
                  name: getFieldStringLocale(attribute.optionsGroup.nameI18n, props.sessionLocale),
                }
              : null,
            name: getFieldStringLocale(attribute.nameI18n, props.sessionLocale),
            metric: attribute.metric
              ? {
                  ...attribute.metric,
                  name: getFieldStringLocale(attribute.metric.nameI18n, props.sessionLocale),
                }
              : null,
          };
        }),
      }),
    },
  };
};

export default Attributes;
