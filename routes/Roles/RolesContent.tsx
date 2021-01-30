import ContentItemControls from 'components/ContentItemControls/ContentItemControls';
import DataLayoutContentFrame from 'components/DataLayout/DataLayoutContentFrame';
import DataLayoutTitle from 'components/DataLayout/DataLayoutTitle';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal/ConfirmModal';
import { CreateRoleModalInterface } from 'components/Modal/CreateRoleModal/CreateRoleModal';
import RequestError from 'components/RequestError/RequestError';
import Spinner from 'components/Spinner/Spinner';
import Table, { TableColumn } from 'components/Table/Table';
import { ROUTE_CMS } from 'config/common';
import { CONFIRM_MODAL, CREATE_ROLE_MODAL } from 'config/modals';
import {
  CmsRoleFragment,
  useCreateRoleMutation,
  useDeleteRoleMutation,
  useGetAllRolesQuery,
} from 'generated/apolloComponents';
import { GET_ALL_ROLES_QUERY } from 'graphql/query/rolesQueries';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import { useRouter } from 'next/router';
import * as React from 'react';

const RolesContent: React.FC = () => {
  const router = useRouter();
  const { onCompleteCallback, onErrorCallback, showModal } = useMutationCallbacks({
    withModal: true,
  });
  const { data, loading, error } = useGetAllRolesQuery({
    fetchPolicy: 'network-only',
  });

  const refetchQueries = [
    {
      query: GET_ALL_ROLES_QUERY,
    },
  ];

  const [deleteRoleMutation] = useDeleteRoleMutation({
    onCompleted: (data) => onCompleteCallback(data.deleteRole),
    onError: onErrorCallback,
    awaitRefetchQueries: true,
    refetchQueries,
  });

  const [createRoleMutation] = useCreateRoleMutation({
    onCompleted: (data) => onCompleteCallback(data.createRole),
    onError: onErrorCallback,
    awaitRefetchQueries: true,
    refetchQueries,
  });

  if (loading) {
    return <Spinner />;
  }

  if (error || !data) {
    return <RequestError />;
  }

  const { getAllRoles } = data;

  const columns: TableColumn<CmsRoleFragment>[] = [
    {
      headTitle: 'Название',
      accessor: 'name',
      render: ({ cellData }) => cellData,
    },
    {
      headTitle: 'Сотрудник сайта',
      accessor: 'isStuff',
      render: ({ cellData }) => (cellData ? 'Да' : 'Нет'),
    },
    {
      render: ({ dataItem }) => {
        return (
          <ContentItemControls
            justifyContent={'flex-end'}
            testId={dataItem.name}
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
        );
      },
    },
  ];

  return (
    <DataLayoutContentFrame>
      <DataLayoutTitle
        titleRight={
          <ContentItemControls
            testId={'roles'}
            createTitle={'Добавить роль'}
            createHandler={() => {
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
          />
        }
      />
      <Table<CmsRoleFragment> columns={columns} data={getAllRoles} testIdKey={'name'} />
    </DataLayoutContentFrame>
  );
};

export default RolesContent;
