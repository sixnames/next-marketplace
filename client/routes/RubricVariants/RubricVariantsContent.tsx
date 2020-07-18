import React from 'react';
import DataLayoutTitle from '../../components/DataLayout/DataLayoutTitle';
import DataLayoutContentFrame from '../../components/DataLayout/DataLayoutContentFrame';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import Table from '../../components/Table/Table';
import ContentItemControls from '../../components/ContentItemControls/ContentItemControls';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { GET_ALL_RUBRIC_VARIANTS } from '../../graphql/query/getAllRubricVariants';
import {
  useCreateRubricVariantMutation,
  useDeleteRubricVariantMutation,
  useGetAllRubricVariantsQuery,
  useUpdateRubricVariantMutation,
} from '../../generated/apolloComponents';
import { CONFIRM_MODAL, UPDATE_NAME_MODAL } from '../../config/modals';
import { LangInterface } from '../../types';

const RubricVariantsContent: React.FC = () => {
  const { showModal, showLoading, onErrorCallback, onCompleteCallback } = useMutationCallbacks({
    withModal: true,
  });

  const { data, loading, error } = useGetAllRubricVariantsQuery();

  const [createRubricVariantMutation] = useCreateRubricVariantMutation({
    refetchQueries: [{ query: GET_ALL_RUBRIC_VARIANTS }],
    awaitRefetchQueries: true,
    onCompleted: (data) => onCompleteCallback(data.createRubricVariant),
    onError: onErrorCallback,
  });

  const [updateRubricVariantMutation] = useUpdateRubricVariantMutation({
    refetchQueries: [{ query: GET_ALL_RUBRIC_VARIANTS }],
    awaitRefetchQueries: true,
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.updateRubricVariant),
  });

  const [deleteRubricVariantMutation] = useDeleteRubricVariantMutation({
    refetchQueries: [{ query: GET_ALL_RUBRIC_VARIANTS }],
    awaitRefetchQueries: true,
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.deleteRubricVariant),
  });

  if (loading) return <Spinner isNested />;
  if (error || !data) return <RequestError />;

  function createRubricVariantHandler() {
    showModal({
      type: UPDATE_NAME_MODAL,
      props: {
        title: 'Название типа рубрики',
        buttonText: 'Создать',
        testId: 'rubric-variant-modal',
        confirm: (values: { name: LangInterface[] }) => {
          showLoading();
          return createRubricVariantMutation({
            variables: {
              input: {
                name: values.name,
              },
            },
          });
        },
      },
    });
  }

  function updateRubricVariantHandler({ nameString, id }: { id: string; nameString: string }) {
    showModal({
      type: UPDATE_NAME_MODAL,
      props: {
        title: 'Название типа рубрики',
        testId: 'rubric-variant-modal',
        oldName: nameString,
        confirm: (values: { name: LangInterface[] }) => {
          showLoading();
          return updateRubricVariantMutation({
            variables: {
              input: {
                name: values.name,
                id,
              },
            },
          });
        },
      },
    });
  }

  function deleteRubricVariantHandler({ nameString, id }: { id: string; nameString: string }) {
    showModal({
      type: CONFIRM_MODAL,
      props: {
        testId: 'rubric-variant-delete-modal',
        message: `Вы уверенны, что хотите тип рубрик ${nameString}?`,
        confirm: () => {
          showLoading();
          return deleteRubricVariantMutation({
            variables: {
              id,
            },
          });
        },
      },
    });
  }

  const columns = [
    {
      key: 'nameString',
      title: 'Название',
      render: (name: string) => name,
    },
    {
      key: 'id',
      title: '',
      textAlign: 'right',
      render: (id: string, { nameString }: { nameString: string }) => {
        return (
          <ContentItemControls
            justifyContent={'flex-end'}
            updateTitle={'Редактировать тип рубрики'}
            updateHandler={() => updateRubricVariantHandler({ id, nameString })}
            deleteTitle={'Удалить тип рубрики'}
            deleteHandler={() => deleteRubricVariantHandler({ id, nameString })}
            testId={nameString}
          />
        );
      },
    },
  ];

  return (
    <div data-cy={'rubric-variants-list'}>
      <DataLayoutTitle
        titleRight={
          <ContentItemControls
            justifyContent={'flex-end'}
            createTitle={'Создать тип рубрики'}
            createHandler={createRubricVariantHandler}
            testId={`rubric-variant`}
          />
        }
      />
      <DataLayoutContentFrame>
        <Table
          data={data.getAllRubricVariants}
          columns={columns}
          emptyMessage={'Список пуст'}
          testIdKey={'nameString'}
        />
      </DataLayoutContentFrame>
    </div>
  );
};

export default RubricVariantsContent;
