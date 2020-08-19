import React from 'react';
import ModalFrame from '../ModalFrame';
import ModalTitle from '../ModalTitle';
import {
  useGetEntityFieldsQuery,
  useGetRoleQuery,
  useSetRoleRuleRestrictedFieldMutation,
} from '../../../generated/apolloComponents';
import ModalText from '../ModalText';
import Spinner from '../../Spinner/Spinner';
import RequestError from '../../RequestError/RequestError';
import Checkbox from '../../FormElements/Checkbox/Checkbox';
import classes from './RoleRestrictedFieldsModal.module.css';
import useMutationCallbacks from '../../../hooks/useMutationCallbacks';
import { GET_ROLE_QUERY } from '../../../graphql/query/roles';

export interface RoleRestrictedFieldsModalInterface {
  roleId: string;
  ruleId: string;
  entity: string;
}

const RoleRestrictedFieldsModal: React.FC<RoleRestrictedFieldsModalInterface> = ({
  roleId,
  ruleId,
  entity,
}) => {
  const { onErrorCallback, onCompleteCallback, showLoading } = useMutationCallbacks({});
  const { data: roleData, loading: roleLoading, error: roleError } = useGetRoleQuery({
    variables: {
      id: roleId,
    },
    fetchPolicy: 'network-only',
  });

  const { data, loading, error } = useGetEntityFieldsQuery({
    variables: {
      entity,
    },
  });

  const [setRoleRuleRestrictedFieldMutation] = useSetRoleRuleRestrictedFieldMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.setRoleRuleRestrictedField),
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: GET_ROLE_QUERY,
        variables: {
          id: roleId,
        },
      },
    ],
  });

  if (loading || roleLoading) return <Spinner />;

  if (error || roleError || !data || !roleData) {
    return (
      <ModalFrame>
        <RequestError />
      </ModalFrame>
    );
  }

  const { getEntityFields } = data;

  const { getRole } = roleData;
  const { rules } = getRole;
  const currentRule = rules.find(({ id }) => id === ruleId);

  if (!currentRule) {
    return (
      <ModalFrame>
        <RequestError />
      </ModalFrame>
    );
  }

  const { restrictedFields } = currentRule;

  if (getEntityFields.length < 1) {
    return (
      <ModalFrame>
        <ModalTitle>Нет полей</ModalTitle>
        <ModalText>
          <p>
            У сущности <span>{currentRule.nameString}</span> нет полей для запрета.
          </p>
        </ModalText>
      </ModalFrame>
    );
  }

  return (
    <ModalFrame testId={'role-restricted-fields-modal'}>
      <ModalTitle>Выберите поля</ModalTitle>
      <ModalText>
        <p>
          Отмеченные поля будут запрещены для чтения в сущности{' '}
          <span>{currentRule.nameString}</span> пользователем с ролью{' '}
          <span>{getRole.nameString}</span>
        </p>
      </ModalText>
      {getEntityFields.map((field) => (
        <label className={classes.label} key={field}>
          <Checkbox
            testId={field}
            name={field}
            checked={restrictedFields.includes(field)}
            value={field}
            onChange={() => {
              showLoading();
              setRoleRuleRestrictedFieldMutation({
                variables: {
                  input: {
                    restrictedField: field,
                    roleId,
                    ruleId,
                  },
                },
              });
            }}
          />
          <span className={classes.labelText}>{field}</span>
        </label>
      ))}
    </ModalFrame>
  );
};

export default RoleRestrictedFieldsModal;
