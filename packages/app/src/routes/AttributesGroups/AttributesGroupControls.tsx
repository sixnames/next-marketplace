import React from 'react';
import useMutationCallbacks from '../../hooks/mutations/useMutationCallbacks';
import ContentItemControls from '../../components/ContentItemControls/ContentItemControls';
import {
  AddAttributeToGroupInput,
  AttributesGroup,
  GetAllAttributesGroupsQuery,
  useAddAttributeToGroupMutation,
  useDeleteAttributesGroupMutation,
  useUpdateAttributesGroupMutation,
} from '../../generated/apolloComponents';
import { ATTRIBUTES_GROUPS_QUERY } from '../../graphql/query/getAllAttributesGroups';
import { ATTRIBUTE_IN_GROUP_MODAL, CONFIRM_MODAL, UPDATE_NAME_MODAL } from '../../config/modals';
import { LangInterface } from '../../types';
import useRouterQuery from '../../hooks/useRouterQuery';

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
  });

  const [deleteAttributesGroupMutation] = useDeleteAttributesGroupMutation({
    update: (cache, { data }) => {
      if (data && data.deleteAttributesGroup && data.deleteAttributesGroup.success) {
        const cacheData: GetAllAttributesGroupsQuery | null = cache.readQuery({
          query: ATTRIBUTES_GROUPS_QUERY,
        });
        if (cacheData) {
          const { getAllAttributesGroups } = cacheData;

          const filteredGroups = getAllAttributesGroups.filter(({ id: groupId }) => {
            return id !== groupId;
          });

          cache.writeQuery({
            query: ATTRIBUTES_GROUPS_QUERY,
            data: {
              getAllAttributesGroups: filteredGroups,
            },
          });

          removeQuery({ key: 'group' });
        }
      }
    },
    onCompleted: (data) => onCompleteCallback(data.deleteAttributesGroup),
    onError: onErrorCallback,
  });

  const [addAttributeToGroupMutation] = useAddAttributeToGroupMutation({
    onCompleted: (data) => onCompleteCallback(data.addAttributeToGroup),
    onError: onErrorCallback,
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
        testId: 'delete-attributes-group',
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

    showModal({
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
