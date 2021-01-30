import * as React from 'react';
import Button from '../../components/Buttons/Button';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import FilterRadioGroup from '../../components/FilterElements/FilterRadio/FilterRadioGroup';
import {
  useCreateOptionsGroupMutation,
  useGetAllOptionsGroupsQuery,
} from 'generated/apolloComponents';
import { OPTIONS_GROUP_MODAL } from 'config/modals';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { OptionsGroupModalInterface } from 'components/Modal/OptionsGroupModal/OptionsGroupModal';
import { OPTIONS_GROUPS_QUERY } from 'graphql/query/optionsQueries';

const OptionsGroupsFilter: React.FC = () => {
  const { data, loading, error } = useGetAllOptionsGroupsQuery({
    fetchPolicy: 'network-only',
  });
  const { onCompleteCallback, onErrorCallback, showLoading, showModal } = useMutationCallbacks({
    withModal: true,
  });

  const [createOptionsGroupMutation] = useCreateOptionsGroupMutation({
    refetchQueries: [{ query: OPTIONS_GROUPS_QUERY }],
    awaitRefetchQueries: true,
    onCompleted: (data) => onCompleteCallback(data.createOptionsGroup),
    onError: onErrorCallback,
  });

  function createOptionsGroupHandler() {
    showModal<OptionsGroupModalInterface>({
      variant: OPTIONS_GROUP_MODAL,
      props: {
        confirm: (values) => {
          showLoading();
          return createOptionsGroupMutation({ variables: { input: values } });
        },
      },
    });
  }

  if (loading) return <Spinner />;
  if (error || !data) return <RequestError />;

  const { getAllOptionsGroups } = data;

  return (
    <React.Fragment>
      <FilterRadioGroup
        radioItems={getAllOptionsGroups}
        queryKey={'optionsGroupId'}
        label={'Группы'}
      />
      <Button size={'small'} onClick={createOptionsGroupHandler} testId={'create-options-group'}>
        Добавить группу
      </Button>
    </React.Fragment>
  );
};

export default OptionsGroupsFilter;
