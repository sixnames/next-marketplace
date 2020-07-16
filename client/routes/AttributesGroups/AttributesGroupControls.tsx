import React from 'react';
import ContentItemControls from '../../components/ContentItemControls/ContentItemControls';
import {
  AddAttributeToGroupInput,
  AttributesGroup,
  useAddAttributeToGroupMutation,
  useDeleteAttributesGroupMutation,
  useUpdateAttributesGroupMutation,
} from '../../generated/apolloComponents';
import { ATTRIBUTES_GROUPS_QUERY } from '../../graphql/query/getAllAttributesGroups';
import { ATTRIBUTE_IN_GROUP_MODAL, CONFIRM_MODAL, UPDATE_NAME_MODAL } from '../../config/modals';
import { LangInterface } from '../../types';
import useRouterQuery from '../../hooks/useRouterQuery';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { AddAttributeToGroupModalInterface } from '../../components/Modal/AttributeInGroupModal/AttributeInGroupModal';
import { ATTRIBUTES_GROUP_QUERY } from '../../graphql/query/getAttributesGroup';

const AttributesGroupControls: React.FC<Pick<AttributesGroup, 'id' | 'nameString'>> = ({
  id,
  nameString,
}) => {
  const { removeQuery } = useRouterQuery();
  const { onCompleteCallback, onErrorCallback, showLoading, showModal } = useMutationCallbacks({
    withModal: true,
  });

  const [updateAttributesGroupMutation] = useUpdateAttributesGroupMutation({
    onCompleted: (data) => onCompleteCallback(data.updateAttributesGroup),
    onError: onErrorCallback,
    awaitRefetchQueries: true,
    refetchQueries: [{ query: ATTRIBUTES_GROUP_QUERY, variables: { id } }],
  });

  const [deleteAttributesGroupMutation] = useDeleteAttributesGroupMutation({
    refetchQueries: [{ query: ATTRIBUTES_GROUPS_QUERY }],
    awaitRefetchQueries: true,
    update: (_cache, { data }) => {
      if (data && data.deleteAttributesGroup && data.deleteAttributesGroup.success) {
        removeQuery({ key: 'group' });
      }
    },
    onCompleted: (data) => onCompleteCallback(data.deleteAttributesGroup),
    onError: onErrorCallback,
  });

  const [addAttributeToGroupMutation] = useAddAttributeToGroupMutation({
    onCompleted: (data) => onCompleteCallback(data.addAttributeToGroup),
    onError: onErrorCallback,
    awaitRefetchQueries: true,
    refetchQueries: [{ query: ATTRIBUTES_GROUP_QUERY, variables: { id } }],
  });

  function updateAttributesGroupHandler() {
    showModal({
      type: UPDATE_NAME_MODAL,
      props: {
        oldName: nameString,
        title: 'Введите новое название группы',
        confirm: (values: { name: LangInterface[] }) => {
          showLoading();
          return updateAttributesGroupMutation({
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

  function deleteAttributesGroupHandler() {
    showModal({
      type: CONFIRM_MODAL,
      props: {
        testId: 'delete-attributes-group-modal',
        message: `Вы уверенны, что хотите удалить группу атрибутов ${nameString}?`,
        confirm: () => {
          showLoading();
          return deleteAttributesGroupMutation({ variables: { id } });
        },
      },
    });
  }

  function addAttributeToGroupHandler() {
    const groupId = id;

    showModal<AddAttributeToGroupModalInterface>({
      type: ATTRIBUTE_IN_GROUP_MODAL,
      props: {
        confirm: (input: Omit<AddAttributeToGroupInput, 'groupId'>) => {
          showLoading();
          return addAttributeToGroupMutation({
            variables: {
              input: {
                groupId,
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
      createTitle={'Добавить атрибут'}
      updateTitle={'Редактировать название'}
      deleteTitle={'Удалить группу'}
      createHandler={addAttributeToGroupHandler}
      updateHandler={updateAttributesGroupHandler}
      deleteHandler={deleteAttributesGroupHandler}
      size={'small'}
      testId={'attributes-group'}
    />
  );
};

export default AttributesGroupControls;
