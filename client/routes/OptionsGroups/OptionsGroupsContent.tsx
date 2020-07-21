import React, { Fragment } from 'react';
import OptionsGroupControls from './OptionsGroupControls';
import DataLayoutTitle from '../../components/DataLayout/DataLayoutTitle';
import RequestError from '../../components/RequestError/RequestError';
import ColorPreview from '../../components/ColorPreview/ColorPreview';
import DataLayoutContentFrame from '../../components/DataLayout/DataLayoutContentFrame';
import Table from '../../components/Table/Table';
import Spinner from '../../components/Spinner/Spinner';
import {
  LanguageType,
  Maybe,
  Option,
  OptionVariant,
  useDeleteOptionFromGroupMutation,
  useGetOptionsGroupQuery,
  useUpdateOptionInGroupMutation,
} from '../../generated/apolloComponents';
import ContentItemControls from '../../components/ContentItemControls/ContentItemControls';
import { CONFIRM_MODAL, OPTION_IN_GROUP_MODAL } from '../../config/modals';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { ObjectType } from '../../types';
import { OptionInGroupModalInterface } from '../../components/Modal/OptionInGroupModal/OptionInGroupModal';
import { OPTIONS_GROUP_QUERY, OPTIONS_GROUPS_QUERY } from '../../graphql/query/options';

interface OptionsGroupsContentInterface {
  query?: ObjectType;
}

export type OptionInGroupType = Pick<Option, 'id' | 'nameString' | 'color' | 'gender'> & {
  name: Array<Pick<LanguageType, 'key' | 'value'>>;
  variants?: Maybe<
    Array<
      Pick<OptionVariant, 'key'> & {
        value: Array<Pick<LanguageType, 'key' | 'value'>>;
      }
    >
  >;
};

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

  function updateOptionInGroupHandler(id: string, option: OptionInGroupType) {
    showModal<OptionInGroupModalInterface>({
      type: OPTION_IN_GROUP_MODAL,
      props: {
        option,
        confirm: (values) => {
          showLoading();
          return updateOptionInGroupMutation({
            awaitRefetchQueries: true,
            refetchQueries: [{ query: OPTIONS_GROUP_QUERY, variables: { id: group } }],
            variables: { input: { ...values, optionId: id, groupId: group } },
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
  const { nameString, id, options, name } = getOptionsGroup;

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
      render: (id: string, option: OptionInGroupType) => {
        const { nameString } = option;

        return (
          <ContentItemControls
            justifyContent={'flex-end'}
            updateTitle={'Редактировать опцию'}
            updateHandler={() => updateOptionInGroupHandler(id, option)}
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
        titleRight={<OptionsGroupControls id={id} name={name} nameString={nameString} />}
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
