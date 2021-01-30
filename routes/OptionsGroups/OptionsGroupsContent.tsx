import * as React from 'react';
import OptionsGroupControls from './OptionsGroupControls';
import DataLayoutTitle from '../../components/DataLayout/DataLayoutTitle';
import RequestError from '../../components/RequestError/RequestError';
import ColorPreview from '../../components/ColorPreview/ColorPreview';
import DataLayoutContentFrame from '../../components/DataLayout/DataLayoutContentFrame';
import Table, { TableColumn } from '../../components/Table/Table';
import Spinner from '../../components/Spinner/Spinner';
import {
  OptionInGroupFragment,
  OptionsGroupVariant,
  useDeleteOptionFromGroupMutation,
  useGetOptionsGroupQuery,
  useUpdateOptionInGroupMutation,
} from 'generated/apolloComponents';
import ContentItemControls from '../../components/ContentItemControls/ContentItemControls';
import { CONFIRM_MODAL, OPTION_IN_GROUP_MODAL } from 'config/modals';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { OptionInGroupModalInterface } from 'components/Modal/OptionInGroupModal/OptionInGroupModal';
import { OPTIONS_GROUP_QUERY, OPTIONS_GROUPS_QUERY } from 'graphql/query/optionsQueries';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal/ConfirmModal';
import Icon from '../../components/Icon/Icon';
import classes from './OptionsGroupsContent.module.css';
import { ObjectType } from 'types/clientTypes';
import { OPTIONS_GROUP_VARIANT_COLOR, OPTIONS_GROUP_VARIANT_ICON } from 'config/common';

interface OptionsGroupsContentInterface {
  query?: ObjectType;
}

const OptionsGroupsContent: React.FC<OptionsGroupsContentInterface> = ({ query = {} }) => {
  const { optionsGroupId } = query;
  const { data, loading, error } = useGetOptionsGroupQuery({
    skip: !optionsGroupId,
    variables: { _id: `${optionsGroupId}` },
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

  function deleteOptionFromGroupHandler(_id: string, name: string) {
    showModal<ConfirmModalInterface>({
      variant: CONFIRM_MODAL,
      props: {
        message: `Вы уверенны, что хотите удалить опцию ${name}?`,
        confirm: () => {
          showLoading();
          return deleteOptionFromGroupMutation({
            awaitRefetchQueries: true,
            refetchQueries: [{ query: OPTIONS_GROUPS_QUERY }],
            variables: { input: { optionsGroupId: `${optionsGroupId}`, optionId: _id } },
          });
        },
      },
    });
  }

  function updateOptionInGroupHandler(option: OptionInGroupFragment) {
    showModal<OptionInGroupModalInterface>({
      variant: OPTION_IN_GROUP_MODAL,
      props: {
        option,
        groupVariant: `${data?.getOptionsGroup?.variant}` as OptionsGroupVariant,
        confirm: (values) => {
          showLoading();
          return updateOptionInGroupMutation({
            awaitRefetchQueries: true,
            refetchQueries: [
              { query: OPTIONS_GROUP_QUERY, variables: { _id: `${optionsGroupId}` } },
            ],
            variables: {
              input: { ...values, optionId: option._id, optionsGroupId: `${optionsGroupId}` },
            },
          });
        },
      },
    });
  }

  if (!optionsGroupId) {
    return <DataLayoutTitle>Выберите группу</DataLayoutTitle>;
  }

  if (loading) {
    return <Spinner isNested />;
  }
  if (error || !data || !data.getOptionsGroup) {
    return <RequestError />;
  }

  const { getOptionsGroup } = data;
  const { name, options, variant } = getOptionsGroup;

  const columns: TableColumn<OptionInGroupFragment>[] = [
    {
      accessor: 'name',
      headTitle: 'Название',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'color',
      headTitle: 'Цвет',
      isHidden: variant !== OPTIONS_GROUP_VARIANT_COLOR,
      render: ({ cellData, dataItem }) => {
        return <ColorPreview color={cellData} testId={dataItem.name} />;
      },
    },
    {
      accessor: 'icon',
      headTitle: 'Иконка',
      isHidden: variant !== OPTIONS_GROUP_VARIANT_ICON,
      render: ({ cellData, dataItem }) => (
        <div data-cy={`${dataItem.name}-icon`}>
          <Icon className={classes.icon} name={cellData} />
        </div>
      ),
    },
    {
      accessor: '_id',
      render: ({ cellData, dataItem }) => {
        const { name } = dataItem;

        return (
          <ContentItemControls
            justifyContent={'flex-end'}
            updateTitle={'Редактировать опцию'}
            updateHandler={() => updateOptionInGroupHandler(dataItem)}
            deleteTitle={'Удалить опцию'}
            deleteHandler={() => deleteOptionFromGroupHandler(cellData, name)}
            testId={`${name}-option`}
          />
        );
      },
    },
  ];

  return (
    <React.Fragment>
      <DataLayoutTitle
        titleRight={<OptionsGroupControls group={getOptionsGroup} />}
        testId={'group-title'}
      >
        {name}
      </DataLayoutTitle>
      <DataLayoutContentFrame>
        <Table<OptionInGroupFragment>
          data={options}
          columns={columns}
          emptyMessage={'В группе нет опций'}
          testIdKey={'name'}
        />
      </DataLayoutContentFrame>
    </React.Fragment>
  );
};

export default OptionsGroupsContent;
