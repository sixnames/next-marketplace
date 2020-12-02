import React, { Fragment } from 'react';
import { useCreateRoleMutation, useGetAllRolesQuery } from '../../generated/apolloComponents';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import FilterRadioGroup from '../../components/FilterElements/FilterRadio/FilterRadioGroup';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { GET_ALL_ROLES_QUERY } from '../../graphql/query/rolesQueries';
import { ROLE_MODAL } from '../../config/modals';
import { RoleModalInterface } from '../../components/Modal/RoleModal/RoleModal';
import Button from '../../components/Buttons/Button';

const RolesFilter: React.FC = () => {
  const { data, loading, error } = useGetAllRolesQuery({
    fetchPolicy: 'network-only',
  });

  const { onCompleteCallback, onErrorCallback, showLoading, showModal } = useMutationCallbacks({
    withModal: true,
  });

  const [createRoleMutation] = useCreateRoleMutation({
    onCompleted: (data) => onCompleteCallback(data.createRole),
    onError: onErrorCallback,
    refetchQueries: [{ query: GET_ALL_ROLES_QUERY }],
    awaitRefetchQueries: true,
  });

  function createRoleHandler() {
    showModal<RoleModalInterface>({
      variant: ROLE_MODAL,
      props: {
        confirm: (values) => {
          showLoading();
          return createRoleMutation({
            variables: {
              input: values,
            },
          });
        },
      },
    });
  }

  if (loading) return <Spinner />;
  if (error || !data) return <RequestError />;

  const { getAllRoles } = data;
  const initialTab = { tab: '0' };

  return (
    <Fragment>
      <FilterRadioGroup radioItems={getAllRoles} queryKey={'role'} additionalQuery={initialTab} />
      <Button size={'small'} onClick={createRoleHandler} testId={'create-role'}>
        Добавить роль
      </Button>
    </Fragment>
  );
};

export default RolesFilter;
