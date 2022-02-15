import Head from 'next/head';
import { useRouter } from 'next/router';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import ContentItemControls from 'components/button/ContentItemControls';
import FixedButtons from 'components/button/FixedButtons';
import WpButton from 'components/button/WpButton';
import Inner from 'components/Inner';
import { RubricVariantModalInterface } from 'components/Modal/RubricVariantModal';
import WpTable, { WpTableColumn } from 'components/WpTable';
import WpTitle from 'components/WpTitle';
import { DEFAULT_COMPANY_SLUG, SORT_DESC } from 'lib/config/common';
import { CONFIRM_MODAL, RUBRIC_VARIANT_MODAL } from 'lib/config/modalVariants';
import { COL_RUBRIC_VARIANTS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { RubricVariantInterface } from 'db/uiInterfaces';
import {
  useCreateRubricVariantMutation,
  useDeleteRubricVariantMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { getFieldStringLocale } from 'lib/i18n';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';

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

  const columns: WpTableColumn<RubricVariantInterface>[] = [
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
              const links = getProjectLinks({
                rubricVariantId: dataItem._id,
              });
              router.push(links.cms.rubricVariants.rubricVariantId.url).catch(console.log);
            }}
            deleteTitle={'Удалить тип рубрики'}
            isDeleteDisabled={dataItem.slug === DEFAULT_COMPANY_SLUG}
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
        <WpTitle>{pageTitle}</WpTitle>
        <WpTable<RubricVariantInterface>
          data={rubricVariants}
          columns={columns}
          emptyMessage={'Список пуст'}
          testIdKey={'name'}
          onRowDoubleClick={(dataItem) => {
            const links = getProjectLinks({
              rubricVariantId: dataItem._id,
            });
            router.push(links.cms.rubricVariants.rubricVariantId.url).catch(console.log);
          }}
        />
        <FixedButtons>
          <WpButton
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
                          companySlug: DEFAULT_COMPANY_SLUG,
                        },
                      },
                    });
                  },
                },
              });
            }}
          >
            Добавить тип рубрики
          </WpButton>
        </FixedButtons>
      </Inner>
    </AppContentWrapper>
  );
};

interface RubricVariantsPageInterface
  extends GetAppInitialDataPropsInterface,
    RubricVariantsConsumerInterface {}

const RubricVariantsPage: NextPage<RubricVariantsPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <RubricVariantsConsumer {...props} />
    </ConsoleLayout>
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
