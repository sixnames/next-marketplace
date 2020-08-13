import React from 'react';
import { RoleContentInterface, RoleOperationType } from './RolesContent';
import Table, { TableColumn } from '../../components/Table/Table';
import {
  OPERATION_TYPE_CREATE,
  OPERATION_TYPE_DELETE,
  OPERATION_TYPE_READ,
  OPERATION_TYPE_UPDATE,
  ROLE_EMPTY_CUSTOM_FILTER,
} from '../../config';
import Checkbox from '../../components/FormElements/Checkbox/Checkbox';
import {
  useSetRoleOperationCustomFilterMutation,
  useSetRoleOperationPermissionMutation,
} from '../../generated/apolloComponents';
import { GET_ROLE_QUERY } from '../../graphql/query/roles';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import Button from '../../components/Buttons/Button';
import classes from './RoleRules.module.css';
import { ROLE_CUSTOM_FILTER_MODAL } from '../../config/modals';
import { RoleCustomFilterModalInterface } from '../../components/Modal/RoleCustomFilterModal/RoleCustomFilterModal';

const RoleRules: React.FC<RoleContentInterface> = ({ role }) => {
  const { rules } = role;
  const { onCompleteCallback, onErrorCallback, showLoading, showModal } = useMutationCallbacks({
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

  const [setRoleOperationCustomFilterMutation] = useSetRoleOperationCustomFilterMutation({
    onCompleted: (data) => onCompleteCallback(data.setRoleOperationCustomFilter),
    onError: onErrorCallback,
    ...refetchConfig,
  });

  const renderOperation = (
    operations: RoleOperationType[],
    currentOperationType: string,
    withCustomFilter?: boolean,
  ) => {
    const currentOperation = operations.find(
      ({ operationType }) => operationType === currentOperationType,
    );
    if (!currentOperation) {
      return null;
    }

    const { operationType, allow, id, customFilter } = currentOperation;

    const isCustomFilterEdited = customFilter !== ROLE_EMPTY_CUSTOM_FILTER;
    const buttonTheme = isCustomFilterEdited ? 'primary' : 'gray';

    return (
      <div className={classes.rule}>
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
        {withCustomFilter && (
          <Button
            className={classes.ruleButton}
            theme={buttonTheme}
            size={'small'}
            onClick={() => {
              showModal<RoleCustomFilterModalInterface>({
                type: ROLE_CUSTOM_FILTER_MODAL,
                props: {
                  customFilter,
                  confirm: (values) => {
                    setRoleOperationCustomFilterMutation({
                      variables: {
                        input: {
                          roleId: role.id,
                          operationId: id,
                          ...values,
                        },
                      },
                    });
                    console.log(values);
                  },
                },
              });
            }}
          >
            фильтр
          </Button>
        )}
      </div>
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
      render: (operations) => renderOperation(operations, OPERATION_TYPE_READ, true),
    },
    {
      key: 'operations',
      title: 'Изменение',
      render: (operations) => renderOperation(operations, OPERATION_TYPE_UPDATE, true),
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
