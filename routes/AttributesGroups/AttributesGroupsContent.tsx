import { AttributesGroupModalInterface } from 'components/Modal/AttributesGroupModal/AttributesGroupModal';
import useRouterQuery from 'hooks/useRouterQuery';
import * as React from 'react';
import {
  AddAttributeToGroupInput,
  AttributeInGroupFragment,
  AttributesGroup,
  UpdateAttributeInGroupInput,
  useAddAttributeToGroupMutation,
  useDeleteAttributeFromGroupMutation,
  useDeleteAttributesGroupMutation,
  useGetAttributesGroupQuery,
  useUpdateAttributeInGroupMutation,
  useUpdateAttributesGroupMutation,
} from 'generated/apolloComponents';
import DataLayoutTitle from '../../components/DataLayout/DataLayoutTitle';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import DataLayoutContentFrame from '../../components/DataLayout/DataLayoutContentFrame';
import Table, { TableColumn } from '../../components/Table/Table';
import ContentItemControls from '../../components/ContentItemControls/ContentItemControls';
import { ATTRIBUTE_IN_GROUP_MODAL, ATTRIBUTES_GROUP_MODAL, CONFIRM_MODAL } from 'config/modals';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { AddAttributeToGroupModalInterface } from 'components/Modal/AttributeInGroupModal/AttributeInGroupModal';
import { ATTRIBUTES_GROUP_QUERY, ATTRIBUTES_GROUPS_QUERY } from 'graphql/query/attributesQueries';
import { ParsedUrlQuery } from 'querystring';
import { getFieldTranslation } from 'config/constantTranslations';
import { useLocaleContext } from 'context/localeContext';

interface AttributesGroupControlsInterface {
  group: Pick<AttributesGroup, '_id' | 'nameI18n' | 'name'>;
}
const AttributesGroupControls: React.FC<AttributesGroupControlsInterface> = ({ group }) => {
  const { _id, name, nameI18n } = group;

  const { removeQuery } = useRouterQuery();
  const { onCompleteCallback, onErrorCallback, showLoading, showModal } = useMutationCallbacks({
    withModal: true,
  });

  const [updateAttributesGroupMutation] = useUpdateAttributesGroupMutation({
    onCompleted: (data) => onCompleteCallback(data.updateAttributesGroup),
    onError: onErrorCallback,
    awaitRefetchQueries: true,
    refetchQueries: [{ query: ATTRIBUTES_GROUP_QUERY, variables: { _id } }],
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
    refetchQueries: [{ query: ATTRIBUTES_GROUP_QUERY, variables: { _id } }],
  });

  function updateAttributesGroupHandler() {
    showModal<AttributesGroupModalInterface>({
      variant: ATTRIBUTES_GROUP_MODAL,
      props: {
        nameI18n,
        confirm: ({ nameI18n }) => {
          showLoading();
          return updateAttributesGroupMutation({
            variables: {
              input: {
                attributesGroupId: _id,
                nameI18n,
              },
            },
          });
        },
      },
    });
  }

  function deleteAttributesGroupHandler() {
    showModal({
      variant: CONFIRM_MODAL,
      props: {
        testId: 'delete-attributes-group-modal',
        message: `Вы уверенны, что хотите удалить группу атрибутов ${name}?`,
        confirm: () => {
          showLoading();
          return deleteAttributesGroupMutation({ variables: { _id } });
        },
      },
    });
  }

  function addAttributeToGroupHandler() {
    const attributesGroupId = _id;

    showModal<AddAttributeToGroupModalInterface>({
      variant: ATTRIBUTE_IN_GROUP_MODAL,
      props: {
        attributesGroupId,
        confirm: (input: Omit<AddAttributeToGroupInput, 'attributesGroupId'>) => {
          showLoading();
          return addAttributeToGroupMutation({
            variables: {
              input: {
                attributesGroupId,
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

interface AttributesGroupsContentInterface {
  query?: ParsedUrlQuery;
}

const AttributesGroupsContent: React.FC<AttributesGroupsContentInterface> = ({ query = {} }) => {
  const { locale } = useLocaleContext();
  const { attributesGroupId } = query;
  const { onCompleteCallback, onErrorCallback, showLoading, showModal } = useMutationCallbacks({
    withModal: true,
  });

  const { data, loading, error } = useGetAttributesGroupQuery({
    skip: !attributesGroupId,
    variables: { _id: `${attributesGroupId}` },
    fetchPolicy: 'network-only',
  });

  const refetchQueries = [
    {
      query: ATTRIBUTES_GROUP_QUERY,
      variables: {
        _id: `${attributesGroupId}`,
      },
    },
  ];

  const [deleteAttributeFromGroupMutation] = useDeleteAttributeFromGroupMutation({
    awaitRefetchQueries: true,
    refetchQueries,
    onCompleted: (data) => onCompleteCallback(data.deleteAttributeFromGroup),
    onError: onErrorCallback,
  });

  const [updateAttributeInGroupMutation] = useUpdateAttributeInGroupMutation({
    awaitRefetchQueries: true,
    refetchQueries,
    onCompleted: (data) => onCompleteCallback(data.updateAttributeInGroup),
    onError: onErrorCallback,
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
      render: ({ dataItem }) => {
        const { name } = dataItem;
        return (
          <ContentItemControls
            justifyContent={'flex-end'}
            updateTitle={'Редактировать атрибут'}
            updateHandler={() => {
              showModal<AddAttributeToGroupModalInterface>({
                variant: ATTRIBUTE_IN_GROUP_MODAL,
                props: {
                  attribute: dataItem,
                  attributesGroupId: `${attributesGroupId}`,
                  confirm: (
                    input: Omit<UpdateAttributeInGroupInput, 'attributesGroupId' | 'attributeId'>,
                  ) => {
                    showLoading();
                    updateAttributeInGroupMutation({
                      variables: {
                        input: {
                          attributesGroupId,
                          attributeId: dataItem._id,
                          ...input,
                        },
                      },
                    }).catch((e) => console.log(e));
                  },
                },
              });
            }}
            deleteTitle={'Удалить атрибут'}
            deleteHandler={() => {
              showModal({
                variant: CONFIRM_MODAL,
                props: {
                  message: `Вы уверенны, что хотите удалить атрибут ${name}?`,
                  confirm: () => {
                    showLoading();
                    return deleteAttributeFromGroupMutation({
                      variables: { input: { attributesGroupId, attributeId: dataItem._id } },
                    });
                  },
                },
              });
            }}
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
