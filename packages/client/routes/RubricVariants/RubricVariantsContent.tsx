import React from 'react';
import DataLayoutTitle from '../../components/DataLayout/DataLayoutTitle';
import DataLayoutContentFrame from '../../components/DataLayout/DataLayoutContentFrame';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import Table, { TableColumn } from '../../components/Table/Table';
import ContentItemControls from '../../components/ContentItemControls/ContentItemControls';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { GET_ALL_RUBRIC_VARIANTS } from '../../graphql/query/rubricVariants';
import {
  RubricVariantFragment,
  useCreateRubricVariantMutation,
  useDeleteRubricVariantMutation,
  useGetAllRubricVariantsQuery,
  useUpdateRubricVariantMutation,
} from '../../generated/apolloComponents';
import { CONFIRM_MODAL, RUBRIC_VARIANT_MODAL } from '../../config/modals';
import { RubricVariantModalInterface } from '../../components/Modal/RubricVariantModal/RubricVariantModal';

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

  if (loading) {
    return <Spinner isNested />;
  }

  if (error || !data) {
    return <RequestError />;
  }

  function createRubricVariantHandler() {
    showModal<RubricVariantModalInterface>({
      type: RUBRIC_VARIANT_MODAL,
      props: {
        confirm: (values) => {
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

  function updateRubricVariantHandler({ name, id }: RubricVariantFragment) {
    showModal<RubricVariantModalInterface>({
      type: RUBRIC_VARIANT_MODAL,
      props: {
        name,
        confirm: (values) => {
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

  function deleteRubricVariantHandler({ nameString, id }: RubricVariantFragment) {
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

  const columns: TableColumn<RubricVariantFragment>[] = [
    {
      key: 'nameString',
      title: 'Название',
      render: ({ cellData }) => cellData,
    },
    {
      key: '',
      title: '',
      textAlign: 'right',
      render: ({ dataItem }) => {
        return (
          <ContentItemControls
            justifyContent={'flex-end'}
            updateTitle={'Редактировать тип рубрики'}
            updateHandler={() => updateRubricVariantHandler(dataItem)}
            deleteTitle={'Удалить тип рубрики'}
            deleteHandler={() => deleteRubricVariantHandler(dataItem)}
            testId={dataItem.nameString}
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
        <Table<RubricVariantFragment>
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
