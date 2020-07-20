import React from 'react';
import ContentItemControls from '../../components/ContentItemControls/ContentItemControls';
import {
  LanguageType,
  useAddOptionToGroupMutation,
  useDeleteOptionsGroupMutation,
  useUpdateOptionsGroupMutation,
} from '../../generated/apolloComponents';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { OPTIONS_GROUPS_QUERY } from '../../graphql/query/getAllOptionsGroups';
import { CONFIRM_MODAL, OPTION_IN_GROUP_MODAL, OPTIONS_GROUP_MODAL } from '../../config/modals';
import useRouterQuery from '../../hooks/useRouterQuery';
import { OptionInGroupModalInterface } from '../../components/Modal/OptionInGroupModal/OptionInGroupModal';
import { OPTIONS_GROUP_QUERY } from '../../graphql/query/getOptionsGroup';
import { OptionsGroupModalInterface } from '../../components/Modal/OptionsGroupModal/OptionsGroupModal';

interface OptionsGroupControlsInterface {
  id: string;
  name: LanguageType[];
  nameString: string;
}

const OptionsGroupControls: React.FC<OptionsGroupControlsInterface> = ({
  id,
  name,
  nameString,
}) => {
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
    refetchQueries: [{ query: OPTIONS_GROUP_QUERY, variables: { id } }],
    awaitRefetchQueries: true,
    onCompleted: (data) => onCompleteCallback(data.addOptionToGroup),
    onError: onErrorCallback,
  });

  function updateOptionsGroupHandler() {
    showModal<OptionsGroupModalInterface>({
      type: OPTIONS_GROUP_MODAL,
      props: {
        name,
        confirm: (values) => {
          showLoading();
          return updateOptionsGroupMutation({
            variables: {
              input: {
                id,
                name: values.name,
              },
            },
          });
        },
      },
    });
  }

  function deleteOptionsGroupHandler() {
    showModal({
      type: CONFIRM_MODAL,
      props: {
        testId: 'delete-options-group',
        message: `Вы уверенны, что хотите удалить группу опций ${nameString}?`,
        confirm: () => {
          showLoading();
          return deleteOptionsGroupMutation({ variables: { id } });
        },
      },
    });
  }

  function addOptionToGroupHandler() {
    showModal<OptionInGroupModalInterface>({
      type: OPTION_IN_GROUP_MODAL,
      props: {
        confirm: (input) => {
          showLoading();
          return addOptionToGroupMutation({
            variables: {
              input: {
                groupId: id,
                ...input,
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
