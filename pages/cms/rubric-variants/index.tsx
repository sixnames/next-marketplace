import Button from 'components/Button';
import FixedButtons from 'components/FixedButtons';
import ContentItemControls from 'components/ContentItemControls';
import Inner from 'components/Inner';
import { RubricVariantModalInterface } from 'components/Modal/RubricVariantModal';
import Table, { TableColumn } from 'components/Table';
import Title from 'components/Title';
import { ROUTE_CMS, SORT_DESC } from 'config/common';
import { CONFIRM_MODAL, RUBRIC_VARIANT_MODAL } from 'config/modalVariants';
import { COL_RUBRIC_VARIANTS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { RubricVariantInterface } from 'db/uiInterfaces';
import {
  useCreateRubricVariantMutation,
  useDeleteRubricVariantMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import AppContentWrapper from 'layout/AppContentWrapper';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { getFieldStringLocale } from 'lib/i18n';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';

interface RubricVariantsConsumerInterface {
  rubricVariants: RubricVariantInterface[];
}

const pageTitle = 'Типы рубрик';

const RubricVariantsConsumer: React.FC<RubricVariantsConsumerInterface> = ({ rubricVariants }) => {
  const router = useRouter();
  const { showModal, showLoading, onErrorCallback, onCompleteCallback } = useMutationCallbacks({
    withModal: true,
    reload: true,
  });

  const [createRubricVariantMutation] = useCreateRubricVariantMutation({
    onCompleted: (data) => onCompleteCallback(data.createRubricVariant),
    onError: onErrorCallback,
  });

  const [deleteRubricVariantMutation] = useDeleteRubricVariantMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.deleteRubricVariant),
  });

  const columns: TableColumn<RubricVariantInterface>[] = [
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
            updateTitle={'Редактировать тип рубрики'}
            updateHandler={() => {
              router.push(`${ROUTE_CMS}/rubric-variants/${dataItem._id}`).catch(console.log);
            }}
            deleteTitle={'Удалить тип рубрики'}
            deleteHandler={() => {
              showModal({
                variant: CONFIRM_MODAL,
                props: {
                  testId: 'rubric-variant-delete-modal',
                  message: `Вы уверенны, что хотите тип рубрик ${dataItem.name}?`,
                  confirm: () => {
                    showLoading();
                    return deleteRubricVariantMutation({
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
      <Inner testId={'rubric-variants-list'}>
        <Title>{pageTitle}</Title>
        <Table<RubricVariantInterface>
          data={rubricVariants}
          columns={columns}
          emptyMessage={'Список пуст'}
          testIdKey={'name'}
          onRowDoubleClick={(dataItem) => {
            router.push(`${ROUTE_CMS}/rubric-variants/${dataItem._id}`).catch(console.log);
          }}
        />
        <FixedButtons>
          <Button
            testId={'create-rubric-variant'}
            size={'small'}
            onClick={() => {
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
            }}
          >
            Добавить тип рубрики
          </Button>
        </FixedButtons>
      </Inner>
    </AppContentWrapper>
  );
};

interface RubricVariantsPageInterface extends PagePropsInterface, RubricVariantsConsumerInterface {}

const RubricVariantsPage: NextPage<RubricVariantsPageInterface> = ({
  pageUrls,
  rubricVariants,
}) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <RubricVariantsConsumer rubricVariants={rubricVariants} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<RubricVariantsPageInterface>> => {
  const { props } = await getAppInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const { db } = await getDatabase();
  const rubricVariantsCollection = db.collection(COL_RUBRIC_VARIANTS);
  const rubricVariantsAggregationResult = await rubricVariantsCollection
    .aggregate([
      {
        $sort: {
          _id: SORT_DESC,
        },
      },
    ])
    .toArray();

  const rubricVariants = rubricVariantsAggregationResult.map((rubricVariant) => {
    return {
      ...rubricVariant,
      name: getFieldStringLocale(rubricVariant.nameI18n, props.sessionLocale),
    };
  });

  return {
    props: {
      ...props,
      rubricVariants: castDbData(rubricVariants),
    },
  };
};

export default RubricVariantsPage;
