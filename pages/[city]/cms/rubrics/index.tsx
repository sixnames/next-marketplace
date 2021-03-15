import ContentItemControls from 'components/ContentItemControls/ContentItemControls';
import DataLayout from 'components/DataLayout/DataLayout';
import DataLayoutContentFrame from 'components/DataLayout/DataLayoutContentFrame';
import DataLayoutTitle from 'components/DataLayout/DataLayoutTitle';
import { CreateRubricModalInterface } from 'components/Modal/CreateRubricModal/CreateRubricModal';
import RequestError from 'components/RequestError/RequestError';
import Spinner from 'components/Spinner/Spinner';
import Table, { TableColumn } from 'components/Table/Table';
import { ROUTE_CMS } from 'config/common';
import { CONFIRM_MODAL, CREATE_RUBRIC_MODAL } from 'config/modals';
import {
  RubricInListFragment,
  useCreateRubricMutation,
  useDeleteRubricMutation,
  useGetAllRubricsQuery,
} from 'generated/apolloComponents';
import { ALL_RUBRICS_QUERY } from 'graphql/complex/rubricsQueries';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useSessionCity from 'hooks/useSessionCity';
import AppLayout from 'layout/AppLayout/AppLayout';
import { useRouter } from 'next/router';
import * as React from 'react';
import { NextPage } from 'next';
import { getAppInitialData } from 'lib/ssrUtils';

const RubricsRoute: React.FC = () => {
  const city = useSessionCity();
  const router = useRouter();
  const { data, loading, error } = useGetAllRubricsQuery({
    fetchPolicy: 'network-only',
  });
  const { onCompleteCallback, onErrorCallback, showModal, showLoading } = useMutationCallbacks({
    withModal: true,
  });

  const [deleteRubricMutation] = useDeleteRubricMutation({
    onCompleted: (data) => onCompleteCallback(data.deleteRubric),
    onError: onErrorCallback,
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: ALL_RUBRICS_QUERY,
      },
    ],
  });

  const [createRubricMutation] = useCreateRubricMutation({
    onCompleted: (data) => onCompleteCallback(data.createRubric),
    onError: onErrorCallback,
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: ALL_RUBRICS_QUERY,
      },
    ],
  });

  const columns: TableColumn<RubricInListFragment>[] = [
    {
      accessor: 'name',
      headTitle: 'Название',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'productsCount',
      headTitle: 'Всего товаров',
      render: ({ cellData, dataItem }) => {
        return <div data-cy={`${dataItem.name}-productsCount`}>{cellData}</div>;
      },
    },
    {
      accessor: 'activeProductsCount',
      headTitle: 'Активных товаров',
      render: ({ cellData, dataItem }) => {
        return <div data-cy={`${dataItem.name}-activeProductsCount`}>{cellData}</div>;
      },
    },
    {
      accessor: 'variant',
      headTitle: 'Тип',
      render: ({ cellData }) => cellData.name,
    },
    {
      render: ({ dataItem }) => {
        return (
          <ContentItemControls
            testId={dataItem.name}
            justifyContent={'flex-end'}
            updateTitle={'Редактировать рубрику'}
            updateHandler={() => {
              router
                .push(`/${city}${ROUTE_CMS}/rubrics/${dataItem.slug}`)
                .catch((e) => console.log(e));
            }}
            deleteTitle={'Удалить рубрику'}
            deleteHandler={() => {
              showModal({
                variant: CONFIRM_MODAL,
                props: {
                  testId: 'delete-rubric-modal',
                  message: 'Рубрика будет удалена',
                  confirm: () => {
                    showLoading();
                    return deleteRubricMutation({
                      variables: {
                        _id: dataItem._id,
                      },
                    });
                  },
                },
              });
            }}
          />
        );
      },
    },
  ];

  if (loading) {
    return <Spinner isNested />;
  }

  if (error) {
    return <RequestError />;
  }

  if (!data || !data.getAllRubrics) {
    return <RequestError />;
  }

  return (
    <DataLayout
      title={'Рубрикатор'}
      filterResult={() => {
        return (
          <React.Fragment>
            <DataLayoutTitle
              titleRight={
                <ContentItemControls
                  justifyContent={'flex-end'}
                  createTitle={'Создать рубрику'}
                  createHandler={() => {
                    showModal<CreateRubricModalInterface>({
                      variant: CREATE_RUBRIC_MODAL,
                      props: {
                        confirm: (values) => {
                          showLoading();
                          return createRubricMutation({ variables: { input: values } });
                        },
                      },
                    });
                  }}
                  testId={'rubrics'}
                />
              }
            />
            <DataLayoutContentFrame>
              <Table<RubricInListFragment>
                columns={columns}
                data={data.getAllRubrics}
                testIdKey={'name'}
                emptyMessage={'Список пуст'}
                onRowDoubleClick={(rubric) => {
                  router
                    .push(`/${city}${ROUTE_CMS}/rubrics/${rubric.slug}/products/1`)
                    .catch((e) => console.log(e));
                }}
              />
            </DataLayoutContentFrame>
          </React.Fragment>
        );
      }}
    />
  );
};

const Rubrics: NextPage = () => {
  return (
    <AppLayout>
      <RubricsRoute />
    </AppLayout>
  );
};

export const getServerSideProps = getAppInitialData;

export default Rubrics;
