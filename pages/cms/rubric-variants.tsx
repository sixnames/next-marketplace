import ContentItemControls from 'components/ContentItemControls/ContentItemControls';
import DataLayout from 'components/DataLayout/DataLayout';
import DataLayoutContentFrame from 'components/DataLayout/DataLayoutContentFrame';
import DataLayoutTitle from 'components/DataLayout/DataLayoutTitle';
import { RubricVariantModalInterface } from 'components/Modal/RubricVariantModal/RubricVariantModal';
import RequestError from 'components/RequestError/RequestError';
import Spinner from 'components/Spinner/Spinner';
import Table, { TableColumn } from 'components/Table/Table';
import { CONFIRM_MODAL, RUBRIC_VARIANT_MODAL } from 'config/modals';
import {
  RubricVariantFragment,
  useCreateRubricVariantMutation,
  useDeleteRubricVariantMutation,
  useGetAllRubricVariantsQuery,
  useUpdateRubricVariantMutation,
} from 'generated/apolloComponents';
import { GET_ALL_RUBRIC_VARIANTS } from 'graphql/query/rubricVariantsQueries';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import AppLayout from 'layout/AppLayout/AppLayout';
import * as React from 'react';
import { GetServerSidePropsContext, NextPage } from 'next';
import { getAppInitialData } from 'lib/ssrUtils';

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
      variant: RUBRIC_VARIANT_MODAL,
      props: {
        confirm: (values) => {
          showLoading();
          return createRubricVariantMutation({
            variables: {
              input: {
                nameI18n: values.nameI18n,
              },
            },
          });
        },
      },
    });
  }

  function updateRubricVariantHandler({ nameI18n, _id }: RubricVariantFragment) {
    showModal<RubricVariantModalInterface>({
      variant: RUBRIC_VARIANT_MODAL,
      props: {
        nameI18n,
        confirm: (values) => {
          showLoading();
          return updateRubricVariantMutation({
            variables: {
              input: {
                nameI18n: values.nameI18n,
                rubricVariantId: _id,
              },
            },
          });
        },
      },
    });
  }

  function deleteRubricVariantHandler({ name, _id }: RubricVariantFragment) {
    showModal({
      variant: CONFIRM_MODAL,
      props: {
        testId: 'rubric-variant-delete-modal',
        message: `Вы уверенны, что хотите тип рубрик ${name}?`,
        confirm: () => {
          showLoading();
          return deleteRubricVariantMutation({
            variables: {
              _id,
            },
          });
        },
      },
    });
  }

  const columns: TableColumn<RubricVariantFragment>[] = [
    {
      accessor: 'name',
      headTitle: 'Название',
      render: ({ cellData }) => cellData,
    },
    {
      render: ({ dataItem }) => {
        return (
          <ContentItemControls
            justifyContent={'flex-end'}
            updateTitle={'Редактировать тип рубрики'}
            updateHandler={() => updateRubricVariantHandler(dataItem)}
            deleteTitle={'Удалить тип рубрики'}
            deleteHandler={() => deleteRubricVariantHandler(dataItem)}
            testId={dataItem.name}
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
          testIdKey={'name'}
        />
      </DataLayoutContentFrame>
    </div>
  );
};

const RubricVariantsRoute: React.FC = () => {
  return <DataLayout title={'Типы рубрик'} filterResult={() => <RubricVariantsContent />} />;
};

const RubricVariants: NextPage = () => {
  return (
    <AppLayout>
      <RubricVariantsRoute />
    </AppLayout>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  return getAppInitialData({ context, isCms: true });
};

export default RubricVariants;
