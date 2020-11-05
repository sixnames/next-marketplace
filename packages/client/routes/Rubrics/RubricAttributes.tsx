import React from 'react';
import {
  AddAttributesGroupToRubricInput,
  GetRubricQuery,
  RubricAttributeFragment,
  useAddAttributesGroupToRubricMutation,
  useDeleteAttributesGroupFromRubricMutation,
  useGetRubricAttributesQuery,
  useUpdateAttributesGroupInRubricMutation,
} from '../../generated/apolloComponents';
import DataLayoutTitle from '../../components/DataLayout/DataLayoutTitle';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import DataLayoutContentFrame from '../../components/DataLayout/DataLayoutContentFrame';
import ContentItemControls from '../../components/ContentItemControls/ContentItemControls';
import Table, { TableColumn } from '../../components/Table/Table';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { ADD_ATTRIBUTES_GROUP_TO_RUBRIC_MODAL, CONFIRM_MODAL } from '../../config/modals';
import { ATTRIBUTE_VARIANT_NUMBER, ATTRIBUTE_VARIANT_STRING } from '@yagu/config';
import Checkbox from '../../components/FormElements/Checkbox/Checkbox';
import Accordion from '../../components/Accordion/Accordion';
import { getAttributeVariantName } from '../../utils/locales';
import InnerWide from '../../components/Inner/InnerWide';
import classes from './RubricAttributes.module.css';
import { RUBRIC_ATTRIBUTES_QUERY } from '../../graphql/complex/rubricsQueries';

interface DeleteAttributesGroupInterface {
  id: string;
  nameString: string;
}

interface RubricDetailsInterface {
  rubric: GetRubricQuery['getRubric'];
}

interface AttributesColumnsInterface {
  groupId: string;
  showInCatalogueFilter: string[];
}

export type AddAttributesGroupToRubricValues = Omit<AddAttributesGroupToRubricInput, 'rubricId'>;

const RubricAttributes: React.FC<RubricDetailsInterface> = ({ rubric }) => {
  const { showModal, onCompleteCallback, onErrorCallback, showLoading } = useMutationCallbacks({
    withModal: true,
  });
  const { data, error, loading } = useGetRubricAttributesQuery({
    fetchPolicy: 'network-only',
    variables: {
      id: rubric.id,
    },
  });

  const refetchConfig = {
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: RUBRIC_ATTRIBUTES_QUERY,
        variables: {
          id: rubric.id,
        },
      },
    ],
  };

  const [deleteAttributesGroupFromRubricMutation] = useDeleteAttributesGroupFromRubricMutation({
    onCompleted: (data) => onCompleteCallback(data.deleteAttributesGroupFromRubric),
    onError: onErrorCallback,
    ...refetchConfig,
  });

  const [addAttributesGroupToRubricMutation] = useAddAttributesGroupToRubricMutation({
    onCompleted: (data) => onCompleteCallback(data.addAttributesGroupToRubric),
    onError: onErrorCallback,
    ...refetchConfig,
  });

  const [updateAttributesGroupInRubricMutation] = useUpdateAttributesGroupInRubricMutation({
    onCompleted: (data) => onCompleteCallback(data.updateAttributesGroupInRubric),
    onError: onErrorCallback,
    ...refetchConfig,
  });

  if (!data && !loading && !error) {
    return <DataLayoutTitle>Выберите рубрику</DataLayoutTitle>;
  }

  if (loading) return <Spinner isNested />;
  if (error || !data || !data.getRubric) return <RequestError />;

  const {
    getRubric: { attributesGroups = [] },
  } = data;

  function deleteAttributesGroupHandler(attributesGroup: DeleteAttributesGroupInterface) {
    showModal({
      type: CONFIRM_MODAL,
      props: {
        testId: 'attributes-group-delete-modal',
        message: `Вы уверены, что хотите удалить группу атрибутов ${attributesGroup.nameString} из рубрики?`,
        confirm: () => {
          showLoading();
          return deleteAttributesGroupFromRubricMutation({
            variables: {
              input: {
                rubricId: rubric.id,
                attributesGroupId: attributesGroup.id,
              },
            },
          });
        },
      },
    });
  }

  function addAttributesGroupToRubricHandler() {
    showModal({
      type: ADD_ATTRIBUTES_GROUP_TO_RUBRIC_MODAL,
      props: {
        testId: 'add-attributes-group-to-rubric-modal',
        exclude: attributesGroups?.map((group) => (group ? group.node.id : '')) ?? [],
        confirm: (values: AddAttributesGroupToRubricValues) => {
          showLoading();
          return addAttributesGroupToRubricMutation({
            variables: {
              input: {
                ...values,
                rubricId: rubric.id,
              },
            },
          });
        },
      },
    });
  }

  const columns = ({
    groupId,
    showInCatalogueFilter,
  }: AttributesColumnsInterface): TableColumn<RubricAttributeFragment>[] => [
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
      accessor: 'optionsGroup',
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
      headTitle: 'Показывать в фильтре',
      render: ({ cellData, dataItem }) => {
        const isDisabled =
          dataItem.variant === ATTRIBUTE_VARIANT_NUMBER ||
          dataItem.variant === ATTRIBUTE_VARIANT_STRING;
        return (
          <Checkbox
            testId={`${dataItem.nameString}`}
            disabled={isDisabled}
            checked={showInCatalogueFilter.includes(cellData)}
            value={cellData}
            name={'showInCatalogueFilter'}
            onChange={() => {
              showLoading();
              updateAttributesGroupInRubricMutation({
                variables: {
                  input: {
                    attributeId: cellData,
                    rubricId: rubric.id,
                    attributesGroupId: groupId,
                  },
                },
              }).catch((e) => console.log(e));
            }}
          />
        );
      },
    },
  ];

  return (
    <div data-cy={'rubric-attributes'}>
      <DataLayoutTitle
        testId={'rubric-title'}
        titleRight={
          <ContentItemControls
            createTitle={'Добавить группу атрибутов в рубрику'}
            testId={rubric.nameString}
            createHandler={addAttributesGroupToRubricHandler}
          />
        }
      >
        {rubric.nameString}
      </DataLayoutTitle>
      <DataLayoutContentFrame>
        <InnerWide>
          {attributesGroups.map(({ node, id, showInCatalogueFilter, isOwner }) => {
            const { nameString, attributes } = node;
            return (
              <div key={id} className={classes.attributesGroup}>
                <Accordion
                  isOpen
                  title={nameString}
                  titleRight={
                    <ContentItemControls
                      disabled={!isOwner}
                      justifyContent={'flex-end'}
                      deleteTitle={'Удалить группу атрибутов из рубрики'}
                      deleteHandler={() => deleteAttributesGroupHandler(node)}
                      testId={node.nameString}
                    />
                  }
                >
                  <Table<RubricAttributeFragment>
                    data={attributes}
                    columns={columns({ groupId: node.id, showInCatalogueFilter })}
                    emptyMessage={'Список атрибутов пуст'}
                    testIdKey={'nameString'}
                  />
                </Accordion>
              </div>
            );
          })}
        </InnerWide>
      </DataLayoutContentFrame>
    </div>
  );
};

export default RubricAttributes;
