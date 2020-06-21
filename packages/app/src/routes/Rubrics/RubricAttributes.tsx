import React from 'react';
import {
  GetRubricQuery,
  useAddAttributesGroupToRubricMutation,
  useDeleteAttributesGroupFromRubricMutation,
  useGetRubricAttributesQuery,
} from '../../generated/apolloComponents';
import DataLayoutTitle from '../../components/DataLayout/DataLayoutTitle';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import DataLayoutContentFrame from '../../components/DataLayout/DataLayoutContentFrame';
import ContentItemControls from '../../components/ContentItemControls/ContentItemControls';
import Table from '../../components/Table/Table';
import useMutationCallbacks from '../../hooks/mutations/useMutationCallbacks';
import { RUBRIC_LEVEL_TWO } from '@rg/config';
import { ADD_ATTRIBUTES_GROUP_TO_RUBRIC_MODAL, CONFIRM_MODAL } from '../../config/modals';

interface AttributesGroupInterface {
  id: string;
  nameString: string;
}

interface RubricDetailsInterface {
  rubric: GetRubricQuery['getRubric'];
}

const RubricAttributes: React.FC<RubricDetailsInterface> = ({ rubric }) => {
  const isNotSecondLevel = rubric.level !== RUBRIC_LEVEL_TWO;

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
        confirm: (attributesGroupId: string) => {
          showLoading();
          return addAttributesGroupToRubricMutation({
            variables: {
              input: {
                attributesGroupId,
                rubricId: rubric.id,
              },
            },
          });
        },
      },
    });
  }

  const columns = [
    {
      key: 'node.nameString',
      title: 'Название',
      render: (name: string) => name,
    },
    {
      key: 'node.id',
      title: '',
      textAlign: 'right',
      render: (_: string, attributesGroup: { node: { nameString: string; id: string } }) => {
        const { node } = attributesGroup;
        return (
          <ContentItemControls
            disabled={isNotSecondLevel}
            justifyContent={'flex-end'}
            deleteTitle={'Удалить группу атрибутов из рубрики'}
            deleteHandler={() => deleteAttributesGroupHandler(node)}
            testId={node.nameString}
          />
        );
      },
    },
  ];

  return (
    <div data-cy={'rubric-attributes'}>
      <DataLayoutTitle
        titleRight={
          <ContentItemControls
            disabled={isNotSecondLevel}
            createTitle={'Добавить группу атрибутов в рубрику'}
            testId={rubric.name}
            createHandler={addAttributesGroupToRubricHandler}
          />
        }
      >
        Атрибуты
      </DataLayoutTitle>
      <DataLayoutContentFrame>
        <Table
          data={attributesGroups}
          columns={columns}
          emptyMessage={'Список пуст'}
          testIdKey={'name'}
        />
      </DataLayoutContentFrame>
    </div>
  );
};

export default RubricAttributes;
