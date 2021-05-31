import FixedButtons from 'components/Buttons/FixedButtons';
import ContentItemControls from 'components/ContentItemControls/ContentItemControls';
import { AddAttributeToGroupModalInterface } from 'components/Modal/AttributeInGroupModal/AttributeInGroupModal';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal/ConfirmModal';
import Table, { TableColumn } from 'components/Table/Table';
import { ROUTE_CMS } from 'config/common';
import { getConstantTranslation } from 'config/constantTranslations';
import { ATTRIBUTE_IN_GROUP_MODAL, CONFIRM_MODAL } from 'config/modals';
import { useLocaleContext } from 'context/localeContext';
import {
  AddAttributeToGroupInput,
  UpdateAttributeInGroupInput,
  useAddAttributeToGroupMutation,
  useDeleteAttributeFromGroupMutation,
  useUpdateAttributeInGroupMutation,
} from 'generated/apolloComponents';
import AppSubNav from 'layout/AppLayout/AppSubNav';
import { ObjectId } from 'mongodb';
import * as React from 'react';
import Button from 'components/Buttons/Button';
import Inner from 'components/Inner/Inner';
import Title from 'components/Title/Title';
import { COL_ATTRIBUTES, COL_ATTRIBUTES_GROUPS, COL_OPTIONS_GROUPS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { AttributeInterface, AttributesGroupInterface } from 'db/uiInterfaces';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import AppContentWrapper from 'layout/AppLayout/AppContentWrapper';
import { getFieldStringLocale } from 'lib/i18n';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import Head from 'next/head';
import { PagePropsInterface } from 'pages/_app';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';

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

  const navConfig = React.useMemo(() => {
    return [
      {
        name: 'Детали',
        testId: 'sub-nav-details',
        path: `${ROUTE_CMS}/attributes/${attributesGroup._id}`,
        exact: true,
      },
      {
        name: 'Атрибуты',
        testId: 'sub-nav-attributes',
        path: `${ROUTE_CMS}/attributes/${attributesGroup._id}/attributes`,
        exact: true,
      },
    ];
  }, [attributesGroup._id]);

  const columns: TableColumn<AttributeInterface>[] = [
    {
      accessor: 'name',
      headTitle: 'Название',
      render: ({ cellData }) => {
        return <div data-cy={`attribute-${cellData}`}>{cellData}</div>;
      },
    },
    {
      accessor: 'variant',
      headTitle: 'Тип',
      render: ({ cellData }) =>
        getConstantTranslation(`selectsOptions.attributeVariants.${cellData}.${locale}`),
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
      render: ({ dataItem }) => {
        const { name } = dataItem;
        return (
          <ContentItemControls
            justifyContent={'flex-end'}
            updateTitle={'Редактировать атрибут'}
            updateHandler={() => updateAttributeHandler(dataItem)}
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
            testId={`${name}-attribute`}
          />
        );
      },
    },
  ];

  return (
    <AppContentWrapper testId={'attributes-list'}>
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
                  confirm: (input: Omit<AddAttributeToGroupInput, 'attributesGroupId'>) => {
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

interface AttributesPageInterface extends PagePropsInterface, AttributesConsumerInterface {}

const Attributes: NextPage<AttributesPageInterface> = ({ attributesGroup, ...props }) => {
  return (
    <CmsLayout title={pageTitle} {...props}>
      <AttributesConsumer attributesGroup={attributesGroup} />
    </CmsLayout>
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

  const db = await getDatabase();
  const attributesGroupsCollection = db.collection<AttributesGroupInterface>(COL_ATTRIBUTES_GROUPS);

  const attributesGroupAggregationResult = await attributesGroupsCollection
    .aggregate([
      {
        $match: {
          _id: new ObjectId(`${query.attributesGroupId}`),
        },
      },
      {
        $lookup: {
          from: COL_ATTRIBUTES,
          as: 'attributes',
          let: { attributesIds: '$attributesIds' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ['$_id', '$$attributesIds'],
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
          };
        }),
      }),
    },
  };
};

export default Attributes;
