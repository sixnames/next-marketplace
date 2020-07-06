import React from 'react';
import ContentItemControls from '../../components/ContentItemControls/ContentItemControls';
import {
  AddOptionToGroupInput,
  useAddOptionToGroupMutation,
  useDeleteOptionsGroupMutation,
  useUpdateOptionsGroupMutation,
} from '../../generated/apolloComponents';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { OPTIONS_GROUPS_QUERY } from '../../graphql/query/getAllOptionsGroups';
import { CONFIRM_MODAL, OPTION_IN_GROUP_MODAL, UPDATE_NAME_MODAL } from '../../config/modals';
import { LangInterface } from '../../types';
import useRouterQuery from '../../hooks/useRouterQuery';

interface OptionsGroupControlsInterface {
  id: string;
  name: string;
}

const OptionsGroupControls: React.FC<OptionsGroupControlsInterface> = ({ id, name }) => {
  const { removeQuery } = useRouterQuery();
  const { onCompleteCallback, onErrorCallback, showLoading, showModal } = useMutationCallbacks({
    withModal: true,
  });

  const [updateOptionsGroupMutation] = useUpdateOptionsGroupMutation({
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
    onCompleted: (data) => onCompleteCallback(data.addOptionToGroup),
    onError: onErrorCallback,
  });

  function updateOptionsGroupHandler() {
    showModal({
      type: UPDATE_NAME_MODAL,
      props: {
        oldName: name,
        title: 'Введите новое название группы',
        confirm: (values: { name: LangInterface[] }) => {
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
        message: `Вы уверенны, что хотите удалить группу опций ${name}?`,
        confirm: () => {
          showLoading();
          return deleteOptionsGroupMutation({ variables: { id } });
        },
      },
    });
  }

  function addOptionToGroupHandler() {
    showModal({
      type: OPTION_IN_GROUP_MODAL,
      props: {
        confirm: (input: Omit<AddOptionToGroupInput, 'groupId'>) => {
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
