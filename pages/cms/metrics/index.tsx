import Button from 'components/Button';
import FixedButtons from 'components/FixedButtons';
import ContentItemControls from 'components/ContentItemControls/ContentItemControls';
import Inner from 'components/Inner';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import { MetricModalInterface } from 'components/Modal/MetricModal';
import Table, { TableColumn } from 'components/Table';
import Title from 'components/Title';
import { SORT_DESC } from 'config/common';
import { CONFIRM_MODAL, METRIC_MODAL } from 'config/modalVariants';
import { COL_METRICS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { MetricInterface } from 'db/uiInterfaces';
import { useDeleteMetricMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import AppContentWrapper from 'layout/AppLayout/AppContentWrapper';
import { getFieldStringLocale } from 'lib/i18n';
import Head from 'next/head';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { createMetricSchema, updateMetricSchema } from 'validation/metricSchema';

const pageTitle = 'Единицы измерения';

interface MetricsConsumerInterface {
  metrics: MetricInterface[];
}

const MetricsConsumer: React.FC<MetricsConsumerInterface> = ({ metrics }) => {
  const { showModal, showLoading, onErrorCallback, onCompleteCallback } = useMutationCallbacks({
    withModal: true,
    reload: true,
  });

  const [deleteMetricMutation] = useDeleteMetricMutation({
    onCompleted: (data) => onCompleteCallback(data.deleteMetric),
    onError: onErrorCallback,
  });

  const createValidationSchema = useValidationSchema({
    schema: createMetricSchema,
  });

  const updateValidationSchema = useValidationSchema({
    schema: updateMetricSchema,
  });

  const columns: TableColumn<MetricInterface>[] = [
    {
      accessor: 'name',
      headTitle: 'Название',
      render: ({ cellData }) => cellData,
    },
    {
      render: ({ dataItem }) => {
        return (
          <ContentItemControls
            testId={`${dataItem.name}`}
            justifyContent={'flex-end'}
            updateTitle={'Обновить метрику'}
            updateHandler={() => {
              showModal<MetricModalInterface>({
                variant: METRIC_MODAL,
                props: {
                  metric: dataItem,
                  validationSchema: updateValidationSchema,
                },
              });
            }}
            deleteTitle={'Удалить метрику'}
            deleteHandler={() => {
              showModal<ConfirmModalInterface>({
                variant: CONFIRM_MODAL,
                props: {
                  testId: 'delete-metric-modal',
                  message: `Вы уверены, что хотите удалить метрику ${dataItem.name}`,
                  confirm: () => {
                    showLoading();
                    return deleteMetricMutation({
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

  return (
    <AppContentWrapper>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <Inner testId={'metrics-list'}>
        <Title>{pageTitle}</Title>
        <div className='overflow-x-auto overflow-y-hidden'>
          <Table<MetricInterface>
            columns={columns}
            data={metrics}
            testIdKey={'name'}
            emptyMessage={'Список пуст'}
          />
        </div>
        <FixedButtons>
          <Button
            size={'small'}
            testId={`create-metric`}
            onClick={() => {
              showModal<MetricModalInterface>({
                variant: METRIC_MODAL,
                props: {
                  validationSchema: createValidationSchema,
                },
              });
            }}
          >
            Создать метрику
          </Button>
        </FixedButtons>
      </Inner>
    </AppContentWrapper>
  );
};

interface MetricsPageInterface extends PagePropsInterface, MetricsConsumerInterface {}

const MetricsPage: NextPage<MetricsPageInterface> = ({ pageUrls, metrics }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <MetricsConsumer metrics={metrics} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<MetricsPageInterface>> => {
  const { props } = await getAppInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const { db } = await getDatabase();
  const metricsCollection = db.collection<MetricInterface>(COL_METRICS);
  const initialMetrics = await metricsCollection
    .aggregate([
      {
        $sort: {
          _id: SORT_DESC,
        },
      },
    ])
    .toArray();

  const metrics = initialMetrics.map((metric) => {
    return {
      ...metric,
      name: getFieldStringLocale(metric.nameI18n, props.sessionLocale),
    };
  });

  return {
    props: {
      ...props,
      metrics: castDbData(metrics),
    },
  };
};

export default MetricsPage;
