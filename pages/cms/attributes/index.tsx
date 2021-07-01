import { useRouter } from 'next/router';
import * as React from 'react';
import Button from 'components/Button';
import FixedButtons from 'components/FixedButtons';
import ContentItemControls from 'components/ContentItemControls/ContentItemControls';
import Inner from 'components/Inner';
import { AttributesGroupModalInterface } from 'components/Modal/AttributesGroupModal';
import Table, { TableColumn } from 'components/Table';
import Title from 'components/Title';
import { ROUTE_CMS, SORT_DESC } from 'config/common';
import { ATTRIBUTES_GROUP_MODAL, CONFIRM_MODAL } from 'config/modalVariants';
import { COL_ATTRIBUTES_GROUPS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { AttributesGroupInterface } from 'db/uiInterfaces';
import {
  useCreateAttributesGroupMutation,
  useDeleteAttributesGroupMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import AppContentWrapper from 'layout/AppLayout/AppContentWrapper';
import { getFieldStringLocale } from 'lib/i18n';
import { noNaN } from 'lib/numbers';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import Head from 'next/head';
import { PagePropsInterface } from 'pages/_app';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';

const pageTitle = `Группы атрибутов`;

interface AttributesGroupsConsumerInterface {
  attributesGroups: AttributesGroupInterface[];
}

const AttributesGroupsConsumer: React.FC<AttributesGroupsConsumerInterface> = ({
  attributesGroups,
}) => {
  const router = useRouter();
  const { onCompleteCallback, onErrorCallback, showLoading, showModal } = useMutationCallbacks({
    withModal: true,
    reload: true,
  });

  const [createAttributesGroupMutation] = useCreateAttributesGroupMutation({
    onCompleted: (data) => onCompleteCallback(data.createAttributesGroup),
    onError: onErrorCallback,
  });

  const [deleteAttributesGroupMutation] = useDeleteAttributesGroupMutation({
    onCompleted: (data) => onCompleteCallback(data.deleteAttributesGroup),
    onError: onErrorCallback,
  });

  const columns: TableColumn<AttributesGroupInterface>[] = [
    {
      accessor: 'name',
      headTitle: 'Название',
      render: ({ cellData }) => {
        return <div data-cy={`attributes-group-${cellData}`}>{cellData}</div>;
      },
    },
    {
      accessor: 'attributesIds',
      headTitle: 'Аттрибутов',
      render: ({ cellData }) => noNaN((cellData || []).length),
    },
    {
      render: ({ dataItem }) => {
        return (
          <div className='flex justify-end'>
            <ContentItemControls
              size={'small'}
              testId={`attributes-group-${dataItem.name}`}
              updateTitle={'Редактировать группу'}
              deleteTitle={'Удалить группу'}
              updateHandler={() => {
                router
                  .push(`${ROUTE_CMS}/attributes/${dataItem._id}/attributes`)
                  .catch(console.log);
              }}
              deleteHandler={() => {
                showModal({
                  variant: CONFIRM_MODAL,
                  props: {
                    testId: 'delete-attributes-group-modal',
                    message: `Вы уверенны, что хотите удалить группу атрибутов ${dataItem.name}?`,
                    confirm: () => {
                      showLoading();
                      return deleteAttributesGroupMutation({ variables: { _id: dataItem._id } });
                    },
                  },
                });
              }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <AppContentWrapper testId={'attribute-groups-list'}>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Inner>
        <Title>{pageTitle}</Title>
        <div className='overflow-x-auto'>
          <Table<AttributesGroupInterface>
            columns={columns}
            data={attributesGroups}
            testIdKey={'name'}
            onRowDoubleClick={(dataItem) => {
              router.push(`${ROUTE_CMS}/attributes/${dataItem._id}/attributes`).catch(console.log);
            }}
          />
        </div>
        <FixedButtons>
          <Button
            testId={'create-attributes-group'}
            size={'small'}
            onClick={() => {
              showModal<AttributesGroupModalInterface>({
                variant: ATTRIBUTES_GROUP_MODAL,
                props: {
                  confirm: (values) => {
                    showLoading();
                    return createAttributesGroupMutation({ variables: { input: values } });
                  },
                },
              });
            }}
          >
            Добавить группу атрибутов
          </Button>
        </FixedButtons>
      </Inner>
    </AppContentWrapper>
  );
};

interface AttributesGroupsInterface extends PagePropsInterface, AttributesGroupsConsumerInterface {}

const AttributesGroups: NextPage<AttributesGroupsInterface> = ({ attributesGroups, ...props }) => {
  return (
    <CmsLayout title={pageTitle} {...props}>
      <AttributesGroupsConsumer attributesGroups={attributesGroups} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<AttributesGroupsInterface>> => {
  const { props } = await getAppInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const { db } = await getDatabase();
  const attributesGroupsCollection = db.collection<AttributesGroupInterface>(COL_ATTRIBUTES_GROUPS);

  const attributesGroupsAggregationResult = await attributesGroupsCollection
    .aggregate([
      {
        $sort: {
          _id: SORT_DESC,
        },
      },
    ])
    .toArray();

  const attributesGroups = attributesGroupsAggregationResult.map((attributesGroup) => {
    return {
      ...attributesGroup,
      name: getFieldStringLocale(attributesGroup.nameI18n, props.sessionLocale),
    };
  });

  return {
    props: {
      ...props,
      attributesGroups: castDbData(attributesGroups),
    },
  };
};

export default AttributesGroups;
