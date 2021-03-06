import ContentItemControls from 'components/button/ContentItemControls';
import FixedButtons from 'components/button/FixedButtons';
import WpButton from 'components/button/WpButton';
import Inner from 'components/Inner';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import { MetricModalInterface } from 'components/Modal/MetricModal';
import WpTable, { WpTableColumn } from 'components/WpTable';
import WpTitle from 'components/WpTitle';
import { getDbCollections } from 'db/mongodb';
import { MetricInterface } from 'db/uiInterfaces';
import { useDeleteMetricMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import { DEFAULT_LOCALE, SORT_ASC } from 'lib/config/common';
import { CONFIRM_MODAL, METRIC_MODAL } from 'lib/config/modalVariants';
import { getFieldStringLocale } from 'lib/i18n';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import Head from 'next/head';
import * as React from 'react';
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

  const columns: WpTableColumn<MetricInterface>[] = [
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
        <WpTitle>{pageTitle}</WpTitle>
        <div className='overflow-x-auto overflow-y-hidden'>
          <WpTable<MetricInterface>
            columns={columns}
            data={metrics}
            testIdKey={'name'}
            emptyMessage={'Список пуст'}
          />
        </div>
        <FixedButtons>
          <WpButton
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
          </WpButton>
        </FixedButtons>
      </Inner>
    </AppContentWrapper>
  );
};

interface MetricsPageInterface extends GetAppInitialDataPropsInterface, MetricsConsumerInterface {}

const MetricsPage: NextPage<MetricsPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <MetricsConsumer {...props} />
    </ConsoleLayout>
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

  const collections = await getDbCollections();
  const metricsCollection = collections.metricsCollection();
  const initialMetrics = await metricsCollection
    .aggregate([
      {
        $sort: {
          [`nameI18n.${DEFAULT_LOCALE}`]: SORT_ASC,
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
