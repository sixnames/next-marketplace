import React from 'react';
import { RoleContentInterface, RoleOperationType } from './RolesContent';
import Table, { TableColumn } from '../../components/Table/Table';
import {
  OPERATION_TYPE_CREATE,
  OPERATION_TYPE_DELETE,
  OPERATION_TYPE_READ,
  OPERATION_TYPE_UPDATE,
} from '../../config';
import Checkbox from '../../components/FormElements/Checkbox/Checkbox';
import { useSetRoleOperationPermissionMutation } from '../../generated/apolloComponents';
import { GET_ROLE_QUERY } from '../../graphql/query/roles';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
// import classes from './RoleRules.module.css';

const RoleRules: React.FC<RoleContentInterface> = ({ role }) => {
  const { rules } = role;
  const { onCompleteCallback, onErrorCallback, showLoading } = useMutationCallbacks({
    withModal: true,
  });

  const refetchConfig = {
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: GET_ROLE_QUERY,
        variables: {
          id: role.id,
        },
      },
    ],
  };

  const [setRoleOperationPermissionMutation] = useSetRoleOperationPermissionMutation({
    onCompleted: (data) => onCompleteCallback(data.setRoleOperationPermission),
    onError: onErrorCallback,
    ...refetchConfig,
  });

  const renderOperation = (operations: RoleOperationType[], currentOperationType: string) => {
    const currentOperation = operations.find(
      ({ operationType }) => operationType === currentOperationType,
    );
    if (!currentOperation) {
      return null;
    }

    const { operationType, allow, id } = currentOperation;
    return (
      <Checkbox
        testId={operationType}
        name={operationType}
        checked={allow}
        value={id}
        onChange={() => {
          showLoading();
          setRoleOperationPermissionMutation({
            variables: {
              input: {
                roleId: role.id,
                operationId: id,
                allow: !allow,
              },
            },
          });
        }}
      />
    );
  };

  const columns: TableColumn[] = [
    {
      key: 'nameString',
      title: 'Сущность',
      render: (nameString) => nameString,
    },
    {
      key: 'operations',
      title: 'Создание',
      render: (operations) => renderOperation(operations, OPERATION_TYPE_CREATE),
    },
    {
      key: 'operations',
      title: 'Чтение',
      render: (operations) => renderOperation(operations, OPERATION_TYPE_READ),
    },
    {
      key: 'operations',
      title: 'Изменение',
      render: (operations) => renderOperation(operations, OPERATION_TYPE_UPDATE),
    },
    {
      key: 'operations',
      title: 'Удаление',
      render: (operations) => renderOperation(operations, OPERATION_TYPE_DELETE),
    },
    {
      key: 'restrictedFields',
      title: 'Запрещённые поля',
      render: (restrictedFields: string[]) => {
        return `${restrictedFields}`;
      },
    },
  ];

  return <Table columns={columns} data={rules} />;
};

export default RoleRules;
