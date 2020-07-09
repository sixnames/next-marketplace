import React, { Fragment } from 'react';
import OptionsGroupControls from './OptionsGroupControls';
import DataLayoutTitle from '../../components/DataLayout/DataLayoutTitle';
import RequestError from '../../components/RequestError/RequestError';
import ColorPreview from '../../components/ColorPreview/ColorPreview';
import DataLayoutContentFrame from '../../components/DataLayout/DataLayoutContentFrame';
import Table from '../../components/Table/Table';
import Spinner from '../../components/Spinner/Spinner';
import {
  useDeleteOptionFromGroupMutation,
  useGetOptionsGroupQuery,
  useUpdateOptionInGroupMutation,
} from '../../generated/apolloComponents';
import ContentItemControls from '../../components/ContentItemControls/ContentItemControls';
import { CONFIRM_MODAL, OPTION_IN_GROUP_MODAL } from '../../config/modals';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { LangInterface, ObjectType } from '../../types';
import { OPTIONS_GROUPS_QUERY } from '../../graphql/query/getAllOptionsGroups';
import { OPTIONS_GROUP_QUERY } from '../../graphql/query/getOptionsGroup';

interface OptionsGroupsContentInterface {
  query?: ObjectType;
}

const OptionsGroupsContent: React.FC<OptionsGroupsContentInterface> = ({ query = {} }) => {
  const { group } = query;
  const { data, loading, error } = useGetOptionsGroupQuery({
    skip: !group,
    variables: { id: group },
    fetchPolicy: 'network-only',
  });

  const { onCompleteCallback, onErrorCallback, showLoading, showModal } = useMutationCallbacks({
    withModal: true,
  });

  const [deleteOptionFromGroupMutation] = useDeleteOptionFromGroupMutation({
    onCompleted: (data) => onCompleteCallback(data.deleteOptionFromGroup),
    onError: onErrorCallback,
  });

  const [updateOptionInGroupMutation] = useUpdateOptionInGroupMutation({
    onCompleted: (data) => onCompleteCallback(data.updateOptionInGroup),
    onError: onErrorCallback,
  });

  function deleteOptionFromGroupHandler(id: string, nameString: string) {
    showModal({
      type: CONFIRM_MODAL,
      props: {
        message: `Вы уверенны, что хотите удалить опцию ${nameString}?`,
        confirm: () => {
          showLoading();
          return deleteOptionFromGroupMutation({
            awaitRefetchQueries: true,
            refetchQueries: [{ query: OPTIONS_GROUPS_QUERY }],
            variables: { input: { groupId: group, optionId: id } },
          });
        },
      },
    });
  }

  function updateOptionInGroupHandler(id: string, nameString: string, color?: string) {
    showModal({
      type: OPTION_IN_GROUP_MODAL,
      props: {
        oldName: nameString,
        color,
        confirm: ({ name, color }: { name: LangInterface[]; color?: string }) => {
          showLoading();
          return updateOptionInGroupMutation({
            awaitRefetchQueries: true,
            refetchQueries: [{ query: OPTIONS_GROUP_QUERY, variables: { id: group } }],
            variables: { input: { groupId: group, optionId: id, name, color } },
          });
        },
      },
    });
  }

  if (!group) {
    return <DataLayoutTitle>Выберите группу</DataLayoutTitle>;
  }

  if (loading) return <Spinner isNested />;
  if (error || !data || !data.getOptionsGroup) return <RequestError />;

  const { getOptionsGroup } = data;
  const { nameString, id, options } = getOptionsGroup;

  const columns = [
    {
      key: 'nameString',
      title: 'Название',
      render: (name: string) => name,
    },
    {
      key: 'color',
      title: 'Цвет',
      render: (color: string, { nameString }: { nameString: string }) => (
        <ColorPreview color={color} testId={nameString} />
      ),
    },
    {
      key: 'id',
      title: '',
      textAlign: 'right',
      render: (id: string, { nameString, color }: { nameString: string; color?: string }) => {
        return (
          <ContentItemControls
            justifyContent={'flex-end'}
            updateTitle={'Редактировать опцию'}
            updateHandler={() => updateOptionInGroupHandler(id, nameString, color)}
            deleteTitle={'Удалить опцию'}
            deleteHandler={() => deleteOptionFromGroupHandler(id, nameString)}
            testId={`${nameString}-option`}
          />
        );
      },
    },
  ];

  return (
    <Fragment>
      <DataLayoutTitle
        titleRight={<OptionsGroupControls id={id} name={nameString} />}
        testId={'group-title'}
      >
        {nameString}
      </DataLayoutTitle>
      <DataLayoutContentFrame>
        <Table
          data={options}
          columns={columns}
          emptyMessage={'В группе нет опций'}
          testIdKey={'nameString'}
        />
      </DataLayoutContentFrame>
    </Fragment>
  );
};

export default OptionsGroupsContent;
