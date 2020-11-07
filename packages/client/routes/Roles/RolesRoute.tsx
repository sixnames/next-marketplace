import React from 'react';
import RolesFilter from './RolesFilter';
import RolesContent from './RolesContent';
import DataLayout from '../../components/DataLayout/DataLayout';
import useTabsConfig from '../../hooks/useTabsConfig';
import useRouterQuery from '../../hooks/useRouterQuery';
import { useDeleteRoleMutation, useGetRoleQuery } from '../../generated/apolloComponents';
import DataLayoutTitle from '../../components/DataLayout/DataLayoutTitle';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { GET_ALL_ROLES_QUERY } from '../../graphql/query/rolesQueries';
import { CONFIRM_MODAL } from '../../config/modals';
import { ConfirmModalInterface } from '../../components/Modal/ConfirmModal/ConfirmModal';

const RolesRoute: React.FC = () => {
  const { query, removeQuery } = useRouterQuery();
  const { role: roleId } = query;
  const { generateTabsConfig } = useTabsConfig();
  const { onCompleteCallback, onErrorCallback, showModal, showLoading } = useMutationCallbacks({
    withModal: true,
  });
  const queryResult = useGetRoleQuery({
    variables: {
      id: `${roleId}`,
    },
    skip: !roleId,
    fetchPolicy: 'network-only',
  });

  const [deleteRoleMutation] = useDeleteRoleMutation({
    onCompleted: (data) => {
      if (data && data.deleteRole && data.deleteRole.success) {
        removeQuery({ key: 'role' });
        onCompleteCallback(data.deleteRole);
      }
    },
    onError: onErrorCallback,
    refetchQueries: [{ query: GET_ALL_ROLES_QUERY }],
    awaitRefetchQueries: true,
  });

  const { data } = queryResult;

  function deleteRoleHandler() {
    if (data && data.getRole) {
      showModal<ConfirmModalInterface>({
        type: CONFIRM_MODAL,
        props: {
          testId: 'delete-role-modal',
          message:
            'Вы уверены, что хотите удалить роль? Всем пользователям с данной ролью будет назначена роль Гость.',
          confirm: () => {
            showLoading();
            return deleteRoleMutation({
              variables: {
                id: data.getRole.id,
              },
            });
          },
        },
      });
    }
  }

  const filterResultNavConfig = generateTabsConfig({
    config: [
      {
        name: 'Доступы',
        testId: 'rules',
      },
      {
        name: 'Навигация в приложении',
        testId: 'app-navigation',
      },
      {
        name: 'Детали',
        testId: 'details',
      },
    ],
  });

  const contentControlsConfig = {
    deleteHandler: deleteRoleHandler,
    deleteTitle: 'Удалить роль',
    testId: 'role',
  };

  return (
    <DataLayout
      title={'Роли'}
      filterContent={<RolesFilter />}
      contentControlsConfig={roleId ? contentControlsConfig : null}
      filterResultNavConfig={roleId ? filterResultNavConfig : null}
      filterResult={() => {
        if (!roleId) {
          return <DataLayoutTitle>Выберите роль</DataLayoutTitle>;
        }

        return <RolesContent queryResult={queryResult} />;
      }}
    />
  );
};

export default RolesRoute;
