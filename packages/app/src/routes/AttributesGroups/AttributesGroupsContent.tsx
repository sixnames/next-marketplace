import React, { Fragment } from 'react';
import {
  Attribute,
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
import Table from '../../components/Table/Table';
import ContentItemControls from '../../components/ContentItemControls/ContentItemControls';
import { getAttributeType } from '../../utils/locales';
import { ATTRIBUTE_IN_GROUP_MODAL, CONFIRM_MODAL } from '../../config/modals';
import useMutationCallbacks from '../../hooks/mutations/useMutationCallbacks';

interface AttributesGroupsContentInterface {
  query?: { [key: string]: any };
}

export interface MetricInterface {
  id: string;
  name: string;
}

export interface OptionInterface {
  id: string;
  name: string;
  color?: string;
}

const AttributesGroupsContent: React.FC<AttributesGroupsContentInterface> = ({ query = {} }) => {
  const { group } = query;
  const { onCompleteCallback, onErrorCallback, showLoading, showModal } = useMutationCallbacks({
    withModal: true,
  });

  const [deleteAttributeFromGroupMutation] = useDeleteAttributeFromGroupMutation({
    onCompleted: (data) => onCompleteCallback(data.deleteAttributeFromGroup),
    onError: onErrorCallback,
  });

  const [updateAttributeInGroupMutation] = useUpdateAttributeInGroupMutation({
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
            variables: { input: { groupId: group, attributeId: id } },
          });
        },
      },
    });
  }

  function updateAttributeInGroupHandler(attribute: Attribute) {
    const { id: attributeId } = attribute;

    showModal({
      type: ATTRIBUTE_IN_GROUP_MODAL,
      props: {
        attribute,
        confirm: (input: Omit<UpdateAttributeInGroupInput, 'groupId' | 'attributeId'>) => {
          showLoading();
          return updateAttributeInGroupMutation({
            variables: {
              input: {
                groupId: group,
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
    variables: { id: group },
  });

  if (!group) {
    return <DataLayoutTitle>Выберите группу</DataLayoutTitle>;
  }

  if (loading) return <Spinner isNested />;
  if (error || !data || !data.getAttributesGroup) return <RequestError />;

  const { getAttributesGroup } = data;
  const { nameString, id, attributes } = getAttributesGroup;

  const columns = [
    {
      key: 'nameString',
      title: 'Название',
      render: (name: string) => name,
    },
    {
      key: 'type',
      title: 'Тип',
      render: (type: string) => getAttributeType(type),
    },
    {
      key: 'options',
      title: 'Опции',
      render: (options: OptionInterface) => (options ? options.name : null),
    },
    {
      key: 'metric',
      title: 'Единица измерения',
      render: (metric: MetricInterface) => (metric ? metric.name : null),
    },
    {
      key: 'id',
      title: '',
      textAlign: 'right',
      render: (id: string, attribute: Attribute) => {
        const { nameString } = attribute;
        return (
          <ContentItemControls
            justifyContent={'flex-end'}
            updateTitle={'Редактировать атрибут'}
            updateHandler={() => updateAttributeInGroupHandler(attribute)}
            deleteTitle={'Удалить атрибут'}
            deleteHandler={() => deleteAttributeFromGroupHandler(id, nameString)}
            testId={`${nameString}-attribute`}
          />
        );
      },
    },
  ];

  return (
    <Fragment>
      <DataLayoutTitle
        titleRight={<AttributesGroupControls id={id} nameString={nameString} />}
        testId={'group-title'}
      >
        {nameString}
      </DataLayoutTitle>
      <DataLayoutContentFrame>
        <Table
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
