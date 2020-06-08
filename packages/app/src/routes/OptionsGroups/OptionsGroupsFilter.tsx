import React, { Fragment } from 'react';
import Button from '../../components/Buttons/Button';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import FilterRadioGroup from '../../components/FilterElements/FilterRadio/FilterRadioGroup';
import {
  GetAllOptionsGroupsQuery,
  useCreateOptionsGroupMutation,
  useGetAllOptionsGroupsQuery,
} from '../../generated/apolloComponents';
import { UPDATE_NAME_MODAL } from '../../config/modals';
import { OPTIONS_GROUPS_QUERY } from '../../graphql/query/getAllOptionsGroups';
import { LangInterface } from '../../types';
import useMutationCallbacks from '../../hooks/mutations/useMutationCallbacks';

const OptionsGroupsFilter: React.FC = () => {
  const { data, loading, error } = useGetAllOptionsGroupsQuery();
  const { onCompleteCallback, onErrorCallback, showLoading, showModal } = useMutationCallbacks({
    withModal: true,
  });

  const [createOptionsGroupMutation] = useCreateOptionsGroupMutation({
    update: (cache, { data }) => {
      if (data) {
        const { createOptionsGroup } = data;
        const cachedData: GetAllOptionsGroupsQuery | null = cache.readQuery({
          query: OPTIONS_GROUPS_QUERY,
        });

        if (cachedData) {
          const { getAllOptionsGroups } = cachedData;
          cache.writeQuery({
            query: OPTIONS_GROUPS_QUERY,
            data: {
              getAllOptionsGroups: [...getAllOptionsGroups, createOptionsGroup.group],
            },
          });
        }
      }
    },
    onCompleted: (data) => onCompleteCallback(data.createOptionsGroup),
    onError: onErrorCallback,
  });

  function createOptionsGroupHandler() {
    showModal({
      type: UPDATE_NAME_MODAL,
      props: {
        title: 'Введите название группы',
        buttonText: 'Добавить',
        testId: 'create-options-group-modal',
        confirm: (values: { name: LangInterface[] }) => {
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
    <Fragment>
      <FilterRadioGroup radioItems={getAllOptionsGroups} queryKey={'group'} label={'Группы'} />
      <Button size={'small'} onClick={createOptionsGroupHandler} testId={'create-options-group'}>
        Добавить группу
      </Button>
    </Fragment>
  );
};

export default OptionsGroupsFilter;
