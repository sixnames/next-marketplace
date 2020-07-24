import React, { Fragment } from 'react';
import {
  useCreateAttributesGroupMutation,
  useGetAllAttributesGroupsQuery,
} from '../../generated/apolloComponents';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import FilterRadioGroup from '../../components/FilterElements/FilterRadio/FilterRadioGroup';
import Button from '../../components/Buttons/Button';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { ATTRIBUTES_GROUP_MODAL } from '../../config/modals';
import { AttributesGroupModalInterface } from '../../components/Modal/AttributesGroupModal/AttributesGroupModal';
import { ATTRIBUTES_GROUPS_QUERY } from '../../graphql/query/attributes';

const AttributesGroupsFilter: React.FC = () => {
  const { data, loading, error } = useGetAllAttributesGroupsQuery({
    fetchPolicy: 'network-only',
  });
  const { onCompleteCallback, onErrorCallback, showLoading, showModal } = useMutationCallbacks({
    withModal: true,
  });

  const [createAttributesGroupMutation] = useCreateAttributesGroupMutation({
    refetchQueries: [{ query: ATTRIBUTES_GROUPS_QUERY }],
    awaitRefetchQueries: true,
    onCompleted: (data) => onCompleteCallback(data.createAttributesGroup),
    onError: onErrorCallback,
  });

  function createAttributesGroupHandler() {
    showModal<AttributesGroupModalInterface>({
      type: ATTRIBUTES_GROUP_MODAL,
      props: {
        confirm: (values) => {
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
