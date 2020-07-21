import React from 'react';
import {
  AddAttributesGroupToRubricInput,
  GetRubricQuery,
  Metric,
  OptionsGroup,
  RubricAttributesGroup,
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
import Table from '../../components/Table/Table';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { ADD_ATTRIBUTES_GROUP_TO_RUBRIC_MODAL, CONFIRM_MODAL } from '../../config/modals';
import { ATTRIBUTE_TYPE_NUMBER, ATTRIBUTE_TYPE_STRING } from '../../config';
import Checkbox from '../../components/FormElements/Checkbox/Checkbox';
import { RUBRIC_ATTRIBUTES_QUERY } from '../../graphql/query/rubrics';
import Accordion from '../../components/Accordion/Accordion';
import { getAttributeVariant } from '../../utils/locales';
import InnerWide from '../../components/Inner/InnerWide';
import classes from './RubricAttributes.module.css';

interface AttributesGroupInterface {
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
type RubricAttribute = RubricAttributesGroup['node']['attributes'][0];

const RubricAttributes: React.FC<RubricDetailsInterface> = ({ rubric }) => {
  const { showModal, onCompleteCallback, onErrorCallback, showLoading } = useMutationCallbacks({
    withModal: true,
  });
  const { data, error, loading } = useGetRubricAttributesQuery({
    variables: {
      id: rubric.id,
    },
    fetchPolicy: 'network-only',
  });

  const [deleteAttributesGroupFromRubricMutation] = useDeleteAttributesGroupFromRubricMutation({
    onCompleted: (data) => onCompleteCallback(data.deleteAttributesGroupFromRubric),
    onError: onErrorCallback,
  });

  const [addAttributesGroupToRubricMutation] = useAddAttributesGroupToRubricMutation({
    onCompleted: (data) => onCompleteCallback(data.addAttributesGroupToRubric),
    onError: onErrorCallback,
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: RUBRIC_ATTRIBUTES_QUERY,
        variables: {
          id: rubric.id,
        },
      },
    ],
  });

  const [updateAttributesGroupInRubricMutation] = useUpdateAttributesGroupInRubricMutation({
    onCompleted: (data) => onCompleteCallback(data.updateAttributesGroupInRubric),
    onError: onErrorCallback,
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: RUBRIC_ATTRIBUTES_QUERY,
        variables: {
          id: rubric.id,
        },
      },
    ],
  });

  if (!data && !loading && !error) {
    return <DataLayoutTitle>Выберите рубрику</DataLayoutTitle>;
  }

  if (loading) return <Spinner isNested />;
  if (error || !data || !data.getRubric) return <RequestError />;

  const {
    getRubric: { attributesGroups = [] },
  } = data;

  function deleteAttributesGroupHandler(attributesGroup: AttributesGroupInterface) {
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

  const columns = ({ groupId, showInCatalogueFilter }: AttributesColumnsInterface) => [
    {
      key: 'nameString',
      title: 'Название',
      render: (name: string) => name,
    },
    {
      key: 'variant',
      title: 'Тип',
      render: (variant: string) => getAttributeVariant(variant),
    },
    {
      key: 'options',
      title: 'Опции',
      render: (options: OptionsGroup) => (options ? options.nameString : null),
    },
    {
      key: 'metric',
      title: 'Единица измерения',
      render: (metric: Metric) => (metric ? metric.nameString : null),
    },
    {
      key: 'id',
      title: 'Показывать в фильтре',
      render: (id: string, { nameString, variant }: RubricAttribute) => {
        const isDisabled = variant === ATTRIBUTE_TYPE_NUMBER || variant === ATTRIBUTE_TYPE_STRING;
        return (
          <Checkbox
            testId={`${nameString}`}
            disabled={isDisabled}
            checked={showInCatalogueFilter.includes(id)}
            value={id}
            name={'showInCatalogueFilter'}
            onChange={() => {
              showLoading();
              updateAttributesGroupInRubricMutation({
                variables: {
                  input: {
                    attributeId: id,
                    rubricId: rubric.id,
                    attributesGroupId: groupId,
                  },
                },
              });
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
                  <Table
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
