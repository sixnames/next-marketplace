import * as React from 'react';
import ContentItemControls from '../../components/ContentItemControls/ContentItemControls';
import {
  Gender,
  OptionsGroupFragment,
  useAddOptionToGroupMutation,
  useDeleteOptionsGroupMutation,
  useUpdateOptionsGroupMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { CONFIRM_MODAL, OPTION_IN_GROUP_MODAL, OPTIONS_GROUP_MODAL } from 'config/modals';
import useRouterQuery from '../../hooks/useRouterQuery';
import { OptionInGroupModalInterface } from 'components/Modal/OptionInGroupModal/OptionInGroupModal';
import { OptionsGroupModalInterface } from 'components/Modal/OptionsGroupModal/OptionsGroupModal';
import { OPTIONS_GROUP_QUERY, OPTIONS_GROUPS_QUERY } from 'graphql/query/optionsQueries';

interface OptionsGroupControlsInterface {
  group: OptionsGroupFragment;
}

const OptionsGroupControls: React.FC<OptionsGroupControlsInterface> = ({ group }) => {
  const { _id, name, variant } = group;
  const { removeQuery } = useRouterQuery();
  const { onCompleteCallback, onErrorCallback, showLoading, showModal } = useMutationCallbacks({
    withModal: true,
  });

  const [updateOptionsGroupMutation] = useUpdateOptionsGroupMutation({
    refetchQueries: [{ query: OPTIONS_GROUPS_QUERY }],
    awaitRefetchQueries: true,
    onCompleted: (data) => onCompleteCallback(data.updateOptionsGroup),
    onError: onErrorCallback,
  });

  const [deleteOptionsGroupMutation] = useDeleteOptionsGroupMutation({
    refetchQueries: [{ query: OPTIONS_GROUPS_QUERY }],
    awaitRefetchQueries: true,
    update: (_cache, { data }) => {
      if (data && data.deleteOptionsGroup.success) {
        removeQuery({ key: 'group' });
      }
    },
    onCompleted: (data) => onCompleteCallback(data.deleteOptionsGroup),
    onError: onErrorCallback,
  });

  const [addOptionToGroupMutation] = useAddOptionToGroupMutation({
    refetchQueries: [{ query: OPTIONS_GROUP_QUERY, variables: { _id } }],
    awaitRefetchQueries: true,
    onCompleted: (data) => onCompleteCallback(data.addOptionToGroup),
    onError: onErrorCallback,
  });

  function updateOptionsGroupHandler() {
    showModal<OptionsGroupModalInterface>({
      variant: OPTIONS_GROUP_MODAL,
      props: {
        group,
        confirm: (values) => {
          showLoading();
          return updateOptionsGroupMutation({
            variables: {
              input: {
                optionsGroupId: _id,
                ...values,
              },
            },
          });
        },
      },
    });
  }

  function deleteOptionsGroupHandler() {
    showModal({
      variant: CONFIRM_MODAL,
      props: {
        testId: 'delete-options-group',
        message: `Вы уверенны, что хотите удалить группу опций ${name}?`,
        confirm: () => {
          showLoading();
          return deleteOptionsGroupMutation({ variables: { _id } });
        },
      },
    });
  }

  function addOptionToGroupHandler() {
    showModal<OptionInGroupModalInterface>({
      variant: OPTION_IN_GROUP_MODAL,
      props: {
        groupVariant: variant,
        confirm: (values) => {
          showLoading();
          return addOptionToGroupMutation({
            variables: {
              input: {
                optionsGroupId: _id,
                ...values,
                gender: values.gender as Gender,
              },
            },
          });
        },
      },
    });
  }

  return (
    <ContentItemControls
      createTitle={'Добавить опцию'}
      updateTitle={'Редактировать название'}
      deleteTitle={'Удалить группу'}
      createHandler={addOptionToGroupHandler}
      updateHandler={updateOptionsGroupHandler}
      deleteHandler={deleteOptionsGroupHandler}
      size={'small'}
      testId={'options-group'}
    />
  );
};

export default OptionsGroupControls;
