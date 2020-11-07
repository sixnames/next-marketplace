import React from 'react';
import { RoleContentInterface, RoleOperationType } from './RolesContent';
import Table, { TableColumn } from '../../components/Table/Table';
import {
  OPERATION_TYPE_CREATE,
  OPERATION_TYPE_DELETE,
  OPERATION_TYPE_READ,
  OPERATION_TYPE_UPDATE,
  ROLE_EMPTY_CUSTOM_FILTER,
} from '@yagu/config';
import Checkbox from '../../components/FormElements/Checkbox/Checkbox';
import {
  RoleRuleFragment,
  useSetRoleOperationCustomFilterMutation,
  useSetRoleOperationPermissionMutation,
} from '../../generated/apolloComponents';
import { GET_ROLE_QUERY } from '../../graphql/query/rolesQueries';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import Button from '../../components/Buttons/Button';
import classes from './RoleRules.module.css';
import { ROLE_CUSTOM_FILTER_MODAL, ROLE_RESTRICTED_FIELDS_MODAL } from '../../config/modals';
import { RoleCustomFilterModalInterface } from '../../components/Modal/RoleCustomFilterModal/RoleCustomFilterModal';
import { RoleRestrictedFieldsModalInterface } from '../../components/Modal/RoleRestrictedFieldsModal/RoleRestrictedFieldsModal';

interface RenderOperationInterface {
  operations: RoleOperationType[];
  currentOperationType: string;
  withCustomFilter?: boolean;
  entity: string;
}

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

  const renderOperation = ({
    operations,
    currentOperationType,
    withCustomFilter,
    entity,
  }: RenderOperationInterface) => {
    const currentOperation = operations.find(
      ({ operationType }) => operationType === currentOperationType,
    );
    if (!currentOperation) {
      return null;
    }

    const { operationType, allow, id, customFilter } = currentOperation;

    const isCustomFilterEdited = customFilter !== ROLE_EMPTY_CUSTOM_FILTER;
    const buttonTheme = isCustomFilterEdited ? 'primary' : 'secondary';

    return (
      <div className={classes.rule}>
        <Checkbox
          testId={`${entity}-${operationType}`}
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
            }).catch((e) => console.log(e));
          }}
        />
        {withCustomFilter && (
          <Button
            className={classes.ruleButton}
            testId={`${entity}-${operationType}-custom-filter`}
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
                    }).catch((e) => console.log(e));
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

  const columns: TableColumn<RoleRuleFragment>[] = [
    {
      accessor: 'nameString',
      headTitle: 'Сущность',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'operations',
      headTitle: 'Создание',
      render: ({ cellData, dataItem }) =>
        renderOperation({
          operations: cellData,
          entity: dataItem.entity,
          currentOperationType: OPERATION_TYPE_CREATE,
        }),
    },
    {
      accessor: 'operations',
      headTitle: 'Чтение',
      render: ({ cellData, dataItem }) =>
        renderOperation({
          operations: cellData,
          entity: dataItem.entity,
          currentOperationType: OPERATION_TYPE_READ,
          withCustomFilter: true,
        }),
    },
    {
      accessor: 'operations',
      headTitle: 'Изменение',
      render: ({ cellData, dataItem }) =>
        renderOperation({
          operations: cellData,
          entity: dataItem.entity,
          currentOperationType: OPERATION_TYPE_UPDATE,
          withCustomFilter: true,
        }),
    },
    {
      accessor: 'operations',
      headTitle: 'Удаление',
      render: ({ cellData, dataItem }) =>
        renderOperation({
          operations: cellData,
          entity: dataItem.entity,
          currentOperationType: OPERATION_TYPE_DELETE,
        }),
    },
    {
      accessor: 'restrictedFields',
      headTitle: 'Запрещённые поля',
      render: ({ cellData, dataItem }) => {
        const { entity, id: ruleId } = dataItem;
        const notEmpty = cellData.length > 0;
        return (
          <Button
            size={'small'}
            testId={`${entity}-restricted-fields`}
            theme={notEmpty ? 'primary' : 'secondary'}
            onClick={() => {
              showModal<RoleRestrictedFieldsModalInterface>({
                type: ROLE_RESTRICTED_FIELDS_MODAL,
                props: {
                  ruleId,
                  roleId: role.id,
                  entity,
                },
              });
            }}
          >
            {notEmpty ? 'показать' : 'выбрать'}
          </Button>
        );
      },
    },
  ];

  return <Table<RoleRuleFragment> columns={columns} data={rules} tableTestId={'role-rules'} />;
};

export default RoleRules;
