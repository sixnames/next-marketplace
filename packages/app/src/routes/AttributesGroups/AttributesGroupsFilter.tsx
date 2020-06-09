import React, { Fragment } from 'react';
import {
  GetAttributesGroupsQuery,
  useCreateAttributesGroupMutation,
  useGetAttributesGroupsQuery,
} from '../../generated/apolloComponents';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import FilterRadioGroup from '../../components/FilterElements/FilterRadio/FilterRadioGroup';
import Button from '../../components/Buttons/Button';
import useMutationCallbacks from '../../hooks/mutations/useMutationCallbacks';
import { ATTRIBUTES_GROUPS_QUERY } from '../../graphql/query/getAllAttributesGroups';
import { UPDATE_NAME_MODAL } from '../../config/modals';
import { LangInterface } from '../../types';

const AttributesGroupsFilter: React.FC = () => {
  const { data, loading, error } = useGetAttributesGroupsQuery();
  const { onCompleteCallback, onErrorCallback, showLoading, showModal } = useMutationCallbacks({
    withModal: true,
  });

  const [createAttributesGroupMutation] = useCreateAttributesGroupMutation({
    update: (cache, { data }) => {
      if (data) {
        const { createAttributesGroup } = data;
        const cachedData: GetAttributesGroupsQuery | null = cache.readQuery({
          query: ATTRIBUTES_GROUPS_QUERY,
        });

        if (cachedData) {
          const { getAllAttributesGroups } = cachedData;
          cache.writeQuery({
            query: ATTRIBUTES_GROUPS_QUERY,
            data: {
              getAllAttributesGroups: [...getAllAttributesGroups, createAttributesGroup.group],
            },
          });
        }
      }
    },
    onCompleted: (data) => onCompleteCallback(data.createAttributesGroup),
    onError: onErrorCallback,
  });

  function createAttributesGroupHandler() {
    showModal({
      type: UPDATE_NAME_MODAL,
      props: {
        title: 'Введите название группы',
        buttonText: 'Добавить',
        testId: 'create-attributes-group-modal',
        confirm: (values: { name: LangInterface[] }) => {
          showLoading();
          return createAttributesGroupMutation({ variables: { input: values } });
        },
      },
    });
  }

  if (loading) return <Spinner />;
  if (error || !data) return <RequestError />;

  const { getAllAttributesGroups } = data;

  return (
    <Fragment>
      <FilterRadioGroup radioItems={getAllAttributesGroups} queryKey={'group'} label={'Группы'} />
      <Button
        size={'small'}
        onClick={createAttributesGroupHandler}
        testId={'create-attributes-group'}
      >
        Добавить группу
      </Button>
    </Fragment>
  );
};

export default AttributesGroupsFilter;
