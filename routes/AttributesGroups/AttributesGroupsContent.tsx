import * as React from 'react';
import {
  AttributeInGroupFragment,
  UpdateAttributeInGroupInput,
  useDeleteAttributeFromGroupMutation,
  useGetAttributesGroupQuery,
  useUpdateAttributeInGroupMutation,
} from 'generated/apolloComponents';
import DataLayoutTitle from '../../components/DataLayout/DataLayoutTitle';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import AttributesGroupControls from './AttributesGroupControls';
import DataLayoutContentFrame from '../../components/DataLayout/DataLayoutContentFrame';
import Table, { TableColumn } from '../../components/Table/Table';
import ContentItemControls from '../../components/ContentItemControls/ContentItemControls';
import { ATTRIBUTE_IN_GROUP_MODAL, CONFIRM_MODAL } from 'config/modals';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { AddAttributeToGroupModalInterface } from 'components/Modal/AttributeInGroupModal/AttributeInGroupModal';
import { ATTRIBUTES_GROUP_QUERY } from 'graphql/query/attributesQueries';
import { ParsedUrlQuery } from 'querystring';
import { getFieldTranslation } from 'config/constantTranslations';
import { useLocaleContext } from 'context/localeContext';

interface AttributesGroupsContentInterface {
  query?: ParsedUrlQuery;
}

const AttributesGroupsContent: React.FC<AttributesGroupsContentInterface> = ({ query = {} }) => {
  const { locale } = useLocaleContext();
  const { attributesGroupId } = query;
  const { onCompleteCallback, onErrorCallback, showLoading, showModal } = useMutationCallbacks({
    withModal: true,
  });

  const [deleteAttributeFromGroupMutation] = useDeleteAttributeFromGroupMutation({
    awaitRefetchQueries: true,
    refetchQueries: [{ query: ATTRIBUTES_GROUP_QUERY, variables: { _id: `${attributesGroupId}` } }],
    onCompleted: (data) => onCompleteCallback(data.deleteAttributeFromGroup),
    onError: onErrorCallback,
  });

  const [updateAttributeInGroupMutation] = useUpdateAttributeInGroupMutation({
    awaitRefetchQueries: true,
    refetchQueries: [{ query: ATTRIBUTES_GROUP_QUERY, variables: { _id: `${attributesGroupId}` } }],
    onCompleted: (data) => onCompleteCallback(data.updateAttributeInGroup),
    onError: onErrorCallback,
  });

  function deleteAttributeFromGroupHandler(_id: string, name: string) {
    showModal({
      variant: CONFIRM_MODAL,
      props: {
        message: `Вы уверенны, что хотите удалить атрибут ${name}?`,
        confirm: () => {
          showLoading();
          return deleteAttributeFromGroupMutation({
            variables: { input: { attributesGroupId, attributeId: _id } },
          });
        },
      },
    });
  }

  function updateAttributeInGroupHandler(attribute: AttributeInGroupFragment) {
    const { _id: attributeId } = attribute;

    showModal<AddAttributeToGroupModalInterface>({
      variant: ATTRIBUTE_IN_GROUP_MODAL,
      props: {
        attribute,
        attributesGroupId: `${attributesGroupId}`,
        confirm: (
          input: Omit<UpdateAttributeInGroupInput, 'attributesGroupId' | 'attributeId'>,
        ) => {
          showLoading();
          return updateAttributeInGroupMutation({
            variables: {
              input: {
                attributesGroupId,
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
    skip: !attributesGroupId,
    variables: { _id: attributesGroupId },
    fetchPolicy: 'network-only',
  });

  if (!attributesGroupId) {
    return <DataLayoutTitle>Выберите группу</DataLayoutTitle>;
  }

  if (loading) {
    return <Spinner isNested />;
  }

  if (error || !data || !data.getAttributesGroup) {
    return <RequestError />;
  }

  const { getAttributesGroup } = data;
  const { name, attributes } = getAttributesGroup;

  const columns: TableColumn<AttributeInGroupFragment>[] = [
    {
      accessor: 'name',
      headTitle: 'Название',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'variant',
      headTitle: 'Тип',
      render: ({ cellData }) =>
        getFieldTranslation(`selectsOptions.attributeVariants.${cellData}.${locale}`),
    },
    {
      accessor: 'optionsGroup',
      headTitle: 'Опции',
      render: ({ cellData }) => cellData?.name || null,
    },
    {
      accessor: 'metric',
      headTitle: 'Единица измерения',
      render: ({ cellData }) => cellData?.name || null,
    },
    {
      accessor: '_id',
      headTitle: '',
      render: ({ cellData, dataItem }) => {
        const { name } = dataItem;
        return (
          <ContentItemControls
            justifyContent={'flex-end'}
            updateTitle={'Редактировать атрибут'}
            updateHandler={() => updateAttributeInGroupHandler(dataItem)}
            deleteTitle={'Удалить атрибут'}
            deleteHandler={() => deleteAttributeFromGroupHandler(cellData, name)}
            testId={`${name}-attribute`}
          />
        );
      },
    },
  ];

  return (
    <React.Fragment>
      <DataLayoutTitle
        titleRight={<AttributesGroupControls group={getAttributesGroup} />}
        testId={'group-title'}
      >
        {name}
      </DataLayoutTitle>
      <DataLayoutContentFrame>
        <Table<AttributeInGroupFragment>
          data={attributes}
          columns={columns}
          emptyMessage={'В группе нет атрибутов'}
          testIdKey={'name'}
        />
      </DataLayoutContentFrame>
    </React.Fragment>
  );
};

export default AttributesGroupsContent;
