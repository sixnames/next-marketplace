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
import { LangInterface } from '../../types';

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

  // TODO LangInput
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

  // TODO LangInput
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
                        ({ id: cachedId }) => cachedId !== id,
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
          data={data?.getAllRubricVariants}
          columns={columns}
          emptyMessage={'Список пуст'}
          testIdKey={'nameString'}
        />
      </DataLayoutContentFrame>
    </div>
  );
};

export default RubricVariantsContent;
