import ContentItemControls from 'components/button/ContentItemControls';
import FixedButtons from 'components/button/FixedButtons';
import WpButton from 'components/button/WpButton';
import Inner from 'components/Inner';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import { CreateRoleModalInterface } from 'components/Modal/CreateRoleModal';
import WpTable, { WpTableColumn } from 'components/WpTable';
import WpTitle from 'components/WpTitle';
import { getDbCollections } from 'db/mongodb';
import { RoleInterface } from 'db/uiInterfaces';
import { useCreateRoleMutation, useDeleteRoleMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import { SORT_DESC } from 'lib/config/common';
import { CONFIRM_MODAL, CREATE_ROLE_MODAL } from 'lib/config/modalVariants';
import { getFieldStringLocale } from 'lib/i18n';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as React from 'react';

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

  const columns: WpTableColumn<RoleInterface>[] = [
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
                const links = getProjectLinks({
                  roleId: dataItem._id,
                });
                router.push(links.cms.roles.roleId.url).catch(console.log);
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
        <WpTitle>{pageTitle}</WpTitle>
        <div className='relative'>
          <div className='overflew-x-auto overflew-y-hidden'>
            <WpTable<RoleInterface>
              columns={columns}
              data={roles}
              testIdKey={'name'}
              onRowDoubleClick={(dataItem) => {
                const links = getProjectLinks({
                  roleId: dataItem._id,
                });
                router.push(links.cms.roles.roleId.url).catch(console.log);
              }}
            />
          </div>
          <FixedButtons>
            <WpButton
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
            </WpButton>
          </FixedButtons>
        </div>
      </Inner>
    </AppContentWrapper>
  );
};

interface RolesPageInterface extends GetAppInitialDataPropsInterface, RolesConsumerInterface {}

const RolesPage: NextPage<RolesPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <RolesConsumer {...props} />
    </ConsoleLayout>
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

  const collections = await getDbCollections();
  const rolesCollection = collections.rolesCollection();
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
