import React, { Fragment } from 'react';
import {
  AttributeInGroupFragment,
  UpdateAttributeInGroupInput,
  useDeleteAttributeFromGroupMutation,
  useGetAttributesGroupQuery,
  useUpdateAttributeInGroupMutation,
} from '../../generated/apolloComponents';
import DataLayoutTitle from '../../components/DataLayout/DataLayoutTitle';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import AttributesGroupControls from './AttributesGroupControls';
import DataLayoutContentFrame from '../../components/DataLayout/DataLayoutContentFrame';
import Table, { TableColumn } from '../../components/Table/Table';
import ContentItemControls from '../../components/ContentItemControls/ContentItemControls';
import { getAttributeVariantName } from '../../utils/locales';
import { ATTRIBUTE_IN_GROUP_MODAL, CONFIRM_MODAL } from '../../config/modals';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { AddAttributeToGroupModalInterface } from '../../components/Modal/AttributeInGroupModal/AttributeInGroupModal';
import { ATTRIBUTES_GROUP_QUERY } from '../../graphql/query/attributes';
import { ParsedUrlQuery } from 'querystring';

interface AttributesGroupsContentInterface {
  query?: ParsedUrlQuery;
}

const AttributesGroupsContent: React.FC<AttributesGroupsContentInterface> = ({ query = {} }) => {
  const { group } = query;
  const groupId = `${group}`;
  const { onCompleteCallback, onErrorCallback, showLoading, showModal } = useMutationCallbacks({
    withModal: true,
  });

  const [deleteAttributeFromGroupMutation] = useDeleteAttributeFromGroupMutation({
    awaitRefetchQueries: true,
    refetchQueries: [{ query: ATTRIBUTES_GROUP_QUERY, variables: { id: group } }],
    onCompleted: (data) => onCompleteCallback(data.deleteAttributeFromGroup),
    onError: onErrorCallback,
  });

  const [updateAttributeInGroupMutation] = useUpdateAttributeInGroupMutation({
    awaitRefetchQueries: true,
    refetchQueries: [{ query: ATTRIBUTES_GROUP_QUERY, variables: { id: group } }],
    onCompleted: (data) => onCompleteCallback(data.updateAttributeInGroup),
    onError: onErrorCallback,
  });

  function deleteAttributeFromGroupHandler(id: string, nameString: string) {
    showModal({
      type: CONFIRM_MODAL,
      props: {
        message: `Вы уверенны, что хотите удалить атрибут ${nameString}?`,
        confirm: () => {
          showLoading();
          return deleteAttributeFromGroupMutation({
            variables: { input: { groupId, attributeId: id } },
          });
        },
      },
    });
  }

  function updateAttributeInGroupHandler(attribute: AttributeInGroupFragment) {
    const { id: attributeId } = attribute;

    showModal<AddAttributeToGroupModalInterface>({
      type: ATTRIBUTE_IN_GROUP_MODAL,
      props: {
        attribute,
        confirm: (input: Omit<UpdateAttributeInGroupInput, 'groupId' | 'attributeId'>) => {
          showLoading();
          return updateAttributeInGroupMutation({
            variables: {
              input: {
                groupId,
                attributeId,
                ...input,
              },
            },
          });
        },
      },
    });
  }

  const { data, loading, error } = useGetAttributesGroupQuery({
    skip: !group,
    variables: { id: groupId },
    fetchPolicy: 'network-only',
  });

  if (!group) {
    return <DataLayoutTitle>Выберите группу</DataLayoutTitle>;
  }

  if (loading) {
    return <Spinner isNested />;
  }

  if (error || !data || !data.getAttributesGroup) {
    return <RequestError />;
  }

  const { getAttributesGroup } = data;
  const { nameString, attributes } = getAttributesGroup;

  const columns: TableColumn<AttributeInGroupFragment>[] = [
    {
      accessor: 'nameString',
      headTitle: 'Название',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'variant',
      headTitle: 'Тип',
      render: ({ cellData }) => getAttributeVariantName(cellData),
    },
    {
      accessor: 'options',
      headTitle: 'Опции',
      render: ({ cellData }) => cellData?.nameString || null,
    },
    {
      accessor: 'metric',
      headTitle: 'Единица измерения',
      render: ({ cellData }) => cellData?.nameString || null,
    },
    {
      accessor: 'id',
      headTitle: '',
      render: ({ cellData, dataItem }) => {
        const { nameString } = dataItem;
        return (
          <ContentItemControls
            justifyContent={'flex-end'}
            updateTitle={'Редактировать атрибут'}
            updateHandler={() => updateAttributeInGroupHandler(dataItem)}
            deleteTitle={'Удалить атрибут'}
            deleteHandler={() => deleteAttributeFromGroupHandler(cellData, nameString)}
            testId={`${nameString}-attribute`}
          />
        );
      },
    },
  ];

  return (
    <Fragment>
      <DataLayoutTitle
        titleRight={<AttributesGroupControls group={getAttributesGroup} />}
        testId={'group-title'}
      >
        {nameString}
      </DataLayoutTitle>
      <DataLayoutContentFrame>
        <Table<AttributeInGroupFragment>
          data={attributes}
          columns={columns}
          emptyMessage={'В группе нет атрибутов'}
          testIdKey={'nameString'}
        />
      </DataLayoutContentFrame>
    </Fragment>
  );
};

export default AttributesGroupsContent;
