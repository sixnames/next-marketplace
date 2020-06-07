import React from 'react';
import DataLayoutTitle from '../../components/DataLayout/DataLayoutTitle';
import DataLayoutContentFrame from '../../components/DataLayout/DataLayoutContentFrame';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import Table from '../../components/Table/Table';
import ContentItemControls from '../../components/ContentItemControls/ContentItemControls';
import useMutationCallbacks from '../../hooks/mutations/useMutationCallbacks';
import { GET_ALL_RUBRIC_VARIANTS } from '../../graphql/query/getAllRubricVariants';
import {
  GetAllRubricVariantsQuery,
  useCreateRubricVariantMutation,
  useDeleteRubricVariantMutation,
  useGetAllRubricVariantsQuery,
  useUpdateRubricVariantMutation,
} from '../../generated/apolloComponents';
import { CONFIRM_MODAL, UPDATE_NAME_MODAL } from '../../config/modals';

const RubricVariantsContent: React.FC = () => {
  const { showModal, showLoading, onErrorCallback, onCompleteCallback } = useMutationCallbacks({
    withModal: true,
  });

  const { data, loading, error } = useGetAllRubricVariantsQuery();

  const [createRubricVariantMutation] = useCreateRubricVariantMutation({
    onCompleted: (data) => onCompleteCallback(data.createRubricVariant),
    onError: onErrorCallback,
    update: (cache, { data }) => {
      if (data && data.createRubricVariant && data.createRubricVariant.success) {
        const cachedData: GetAllRubricVariantsQuery | null = cache.readQuery({
          query: GET_ALL_RUBRIC_VARIANTS,
        });
        if (cachedData && cachedData.getAllRubricVariants) {
          cache.writeQuery({
            query: GET_ALL_RUBRIC_VARIANTS,
            data: {
              getAllRubricVariants: [
                ...cachedData.getAllRubricVariants,
                data.createRubricVariant.variant,
              ],
            },
          });
        }
      }
    },
  });

  const [updateRubricVariantMutation] = useUpdateRubricVariantMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.updateRubricVariant),
  });

  const [deleteRubricVariantMutation] = useDeleteRubricVariantMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.deleteRubricVariant),
  });

  if (loading) return <Spinner isNested />;
  if (error || !data) return <RequestError />;

  // TODO [Slava] LangInput
  function createRubricVariantHandler() {
    showModal({
      type: UPDATE_NAME_MODAL,
      props: {
        title: 'Название типа рубрики',
        buttonText: 'Создать',
        testId: 'rubric-type-modal',
        confirm: (values: { name: string }) => {
          showLoading();
          return createRubricVariantMutation({
            variables: {
              input: {
                name: [{ key: 'ru', value: values.name }],
              },
            },
          });
        },
      },
    });
  }

  // TODO [Slava] LangInput
  function updateRubricVariantHandler({ name, id }: { id: string; name: string }) {
    showModal({
      type: UPDATE_NAME_MODAL,
      props: {
        title: 'Название типа рубрики',
        testId: 'rubric-type-modal',
        oldName: name,
        confirm: (values: { name: string }) => {
          showLoading();
          return updateRubricVariantMutation({
            variables: {
              input: {
                name: [{ key: 'ru', value: values.name }],
                id,
              },
            },
          });
        },
      },
    });
  }

  function deleteRubricVariantHandler({ name, id }: { id: string; name: string }) {
    showModal({
      type: CONFIRM_MODAL,
      props: {
        testId: 'rubric-type-delete-modal',
        message: `Вы уверенны, что хотите тип рубрик ${name}?`,
        confirm: () => {
          showLoading();
          return deleteRubricVariantMutation({
            variables: {
              id,
            },
            update: (cache, { data }) => {
              if (data && data.deleteRubricVariant && data.deleteRubricVariant.success) {
                const cachedData: GetAllRubricVariantsQuery | null = cache.readQuery({
                  query: GET_ALL_RUBRIC_VARIANTS,
                });
                if (cachedData && cachedData.getAllRubricVariants) {
                  cache.writeQuery({
                    query: GET_ALL_RUBRIC_VARIANTS,
                    data: {
                      getAllRubricVariants: cachedData.getAllRubricVariants.filter(
                        ({ id: itemId }) => itemId !== id,
                      ),
                    },
                  });
                }
              }
            },
          });
        },
      },
    });
  }

  const columns = [
    {
      key: 'name',
      title: 'Название',
      render: (name: string) => name,
    },
    {
      key: 'id',
      title: '',
      textAlign: 'right',
      render: (id: string, { name }: { name: string }) => {
        return (
          <ContentItemControls
            justifyContent={'flex-end'}
            updateTitle={'Редактировать тип рубрики'}
            updateHandler={() => updateRubricVariantHandler({ id, name })}
            deleteTitle={'Удалить тип рубрики'}
            deleteHandler={() => deleteRubricVariantHandler({ id, name })}
            testId={name}
          />
        );
      },
    },
  ];

  return (
    <div data-cy={'rubric-types-list'}>
      <DataLayoutTitle
        titleRight={
          <ContentItemControls
            justifyContent={'flex-end'}
            createTitle={'Создать тип рубрики'}
            createHandler={createRubricVariantHandler}
            testId={`rubric-type`}
          />
        }
      />
      <DataLayoutContentFrame>
        <Table
          data={data?.getAllRubricVariants}
          columns={columns}
          emptyMessage={'Список пуст'}
          testIdKye={'name'}
        />
      </DataLayoutContentFrame>
    </div>
  );
};

export default RubricVariantsContent;
