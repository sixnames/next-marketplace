import Button from 'components/Button';
import FixedButtons from 'components/FixedButtons';
import ContentItemControls from 'components/ContentItemControls/ContentItemControls';
import Inner from 'components/Inner';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import { CreateRoleModalInterface } from 'components/Modal/CreateRoleModal';
import Table, { TableColumn } from 'components/Table';
import Title from 'components/Title';
import { ROUTE_CMS, SORT_DESC } from 'config/common';
import { CONFIRM_MODAL, CREATE_ROLE_MODAL } from 'config/modalVariants';
import { COL_ROLES } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { RoleInterface } from 'db/uiInterfaces';
import { useCreateRoleMutation, useDeleteRoleMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import AppContentWrapper from 'layout/AppContentWrapper';
import { getFieldStringLocale } from 'lib/i18n';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';

interface RolesConsumerInterface {
  roles: RoleInterface[];
}

const pageTitle = 'Роли';

const RolesConsumer: React.FC<RolesConsumerInterface> = ({ roles }) => {
  const router = useRouter();
  const { onCompleteCallback, onErrorCallback, showModal } = useMutationCallbacks({
    withModal: true,
    reload: true,
  });

  const [deleteRoleMutation] = useDeleteRoleMutation({
    onCompleted: (data) => onCompleteCallback(data.deleteRole),
    onError: onErrorCallback,
  });

  const [createRoleMutation] = useCreateRoleMutation({
    onCompleted: (data) => onCompleteCallback(data.createRole),
    onError: onErrorCallback,
  });

  const columns: TableColumn<RoleInterface>[] = [
    {
      headTitle: 'Название',
      accessor: 'name',
      render: ({ cellData }) => cellData,
    },
    {
      headTitle: 'Сотрудник сайта',
      accessor: 'isStaff',
      render: ({ cellData }) => (cellData ? 'Да' : 'Нет'),
    },
    {
      headTitle: 'Сотрудник компании',
      accessor: 'isCompanyStaff',
      render: ({ cellData }) => (cellData ? 'Да' : 'Нет'),
    },
    {
      render: ({ dataItem }) => {
        return (
          <div className='flex justify-end'>
            <ContentItemControls
              testId={`${dataItem.name}`}
              updateTitle={'Редактировать роль'}
              updateHandler={() => {
                router.push(`${ROUTE_CMS}/roles/${dataItem._id}`).catch((e) => console.log(e));
              }}
              deleteTitle={'Удалить роль'}
              deleteHandler={() => {
                showModal<ConfirmModalInterface>({
                  variant: CONFIRM_MODAL,
                  props: {
                    testId: 'delete-role-modal',
                    message:
                      'Вы уверены, что хотите удалить роль? Всем пользователям с данной ролью будет назначена роль Гость.',
                    confirm: () => {
                      deleteRoleMutation({
                        variables: { _id: dataItem._id },
                      }).catch((e) => console.log(e));
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
    <AppContentWrapper>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Inner>
        <Title>{pageTitle}</Title>
        <div className='relative'>
          <div className='overflew-x-auto overflew-y-hidden'>
            <Table<RoleInterface>
              columns={columns}
              data={roles}
              testIdKey={'name'}
              onRowDoubleClick={(dataItem) => {
                router.push(`${ROUTE_CMS}/roles/${dataItem._id}`).catch((e) => console.log(e));
              }}
            />
          </div>
          <FixedButtons>
            <Button
              size={'small'}
              onClick={() => {
                showModal<CreateRoleModalInterface>({
                  variant: CREATE_ROLE_MODAL,
                  props: {
                    confirm: (values) => {
                      createRoleMutation({
                        variables: {
                          input: values,
                        },
                      }).catch((e) => console.log(e));
                    },
                  },
                });
              }}
              testId={'create-role'}
            >
              Добавить роль
            </Button>
          </FixedButtons>
        </div>
      </Inner>
    </AppContentWrapper>
  );
};

interface RolesPageInterface extends PagePropsInterface, RolesConsumerInterface {}

const RolesPage: NextPage<RolesPageInterface> = ({ pageUrls, roles }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <RolesConsumer roles={roles} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<RolesPageInterface>> => {
  const { props } = await getAppInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const { db } = await getDatabase();
  const rolesCollection = db.collection<RoleInterface>(COL_ROLES);
  const rolesAggregationResult = await rolesCollection
    .aggregate([
      {
        $sort: {
          _id: SORT_DESC,
        },
      },
    ])
    .toArray();

  const roles = rolesAggregationResult.map((role) => {
    return {
      ...role,
      name: getFieldStringLocale(role.nameI18n, props.sessionLocale),
    };
  });

  return {
    props: {
      ...props,
      roles: castDbData(roles),
    },
  };
};

export default RolesPage;
