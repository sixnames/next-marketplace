import Button from 'components/Buttons/Button';
import FixedButtons from 'components/Buttons/FixedButtons';
import ContentItemControls from 'components/ContentItemControls/ContentItemControls';
import Inner from 'components/Inner/Inner';
import { OptionsGroupModalInterface } from 'components/Modal/OptionsGroupModal/OptionsGroupModal';
import Table, { TableColumn } from 'components/Table/Table';
import Title from 'components/Title/Title';
import { ROUTE_CMS, SORT_DESC } from 'config/common';
import { getConstantTranslation } from 'config/constantTranslations';
import { CONFIRM_MODAL, OPTIONS_GROUP_MODAL } from 'config/modals';
import { COL_OPTIONS, COL_OPTIONS_GROUPS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { OptionsGroupInterface } from 'db/uiInterfaces';
import {
  useCreateOptionsGroupMutation,
  useDeleteOptionsGroupMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import AppContentWrapper from 'layout/AppLayout/AppContentWrapper';
import { getFieldStringLocale } from 'lib/i18n';
import { noNaN } from 'lib/numbers';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as React from 'react';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { PagePropsInterface } from 'pages/_app';

interface OptionsGroupsConsumerInterface {
  optionsGroups: OptionsGroupInterface[];
}

const pageTitle = 'Группы опций';

const OptionsGroupsConsumer: React.FC<OptionsGroupsConsumerInterface> = ({ optionsGroups }) => {
  const router = useRouter();
  const { onCompleteCallback, onErrorCallback, showLoading, showModal } = useMutationCallbacks({
    withModal: true,
    reload: true,
  });

  const [createOptionsGroupMutation] = useCreateOptionsGroupMutation({
    onCompleted: (data) => onCompleteCallback(data.createOptionsGroup),
    onError: onErrorCallback,
  });

  const [deleteOptionsGroupMutation] = useDeleteOptionsGroupMutation({
    onCompleted: (data) => onCompleteCallback(data.deleteOptionsGroup),
    onError: onErrorCallback,
  });

  const columns: TableColumn<OptionsGroupInterface>[] = [
    {
      accessor: 'name',
      headTitle: 'Название',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'variantName',
      headTitle: 'Тип',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'optionsCount',
      headTitle: 'Опций',
      render: ({ cellData }) => noNaN(cellData),
    },
    {
      render: ({ dataItem }) => {
        return (
          <div className='flex justify-end'>
            <ContentItemControls
              testId={`${dataItem.name}`}
              deleteTitle={'Удалить группу опций'}
              updateTitle={'Редактировать группу опций'}
              deleteHandler={() => {
                showModal({
                  variant: CONFIRM_MODAL,
                  props: {
                    testId: 'delete-options-group',
                    message: `Вы уверенны, что хотите удалить группу опций ${dataItem.name}?`,
                    confirm: () => {
                      showLoading();
                      return deleteOptionsGroupMutation({
                        variables: {
                          _id: dataItem._id,
                        },
                      });
                    },
                  },
                });
              }}
              updateHandler={() => {
                router.push(`${ROUTE_CMS}/options/${dataItem._id}`).catch((e) => console.log(e));
              }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <AppContentWrapper>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Inner testId={'options-groups-list'}>
        <Title>{pageTitle}</Title>

        <div className='relative'>
          <div className='overflow-x-auto overflow-y-hidden'>
            <Table<OptionsGroupInterface>
              testIdKey={'name'}
              columns={columns}
              data={optionsGroups}
              onRowDoubleClick={(dataItem) => {
                router.push(`${ROUTE_CMS}/options/${dataItem._id}`).catch((e) => console.log(e));
              }}
            />
          </div>
          <FixedButtons>
            <Button
              size={'small'}
              testId='create-options-group'
              onClick={() => {
                showModal<OptionsGroupModalInterface>({
                  variant: OPTIONS_GROUP_MODAL,
                  props: {
                    confirm: (values) => {
                      showLoading();
                      return createOptionsGroupMutation({ variables: { input: values } });
                    },
                  },
                });
              }}
            >
              Добавить группу опций
            </Button>
          </FixedButtons>
        </div>
      </Inner>
    </AppContentWrapper>
  );
};

interface OptionsGroupsPageInterface extends PagePropsInterface, OptionsGroupsConsumerInterface {}

const OptionsGroupsPage: NextPage<OptionsGroupsPageInterface> = ({ pageUrls, optionsGroups }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <OptionsGroupsConsumer optionsGroups={optionsGroups} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<OptionsGroupsPageInterface>> => {
  const { props } = await getAppInitialData({ context, isCms: true });

  if (!props) {
    return {
      notFound: true,
    };
  }

  const db = await getDatabase();
  const optionsGroupsCollection = await db.collection<OptionsGroupInterface>(COL_OPTIONS_GROUPS);

  const optionsGroupsAggregationResult = await optionsGroupsCollection
    .aggregate([
      {
        $sort: {
          _id: SORT_DESC,
        },
      },
      {
        $lookup: {
          from: COL_OPTIONS,
          as: 'optionsCount',
          let: { optionsGroupId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$optionsGroupId', '$$optionsGroupId'],
                },
              },
            },
            {
              $count: 'counter',
            },
          ],
        },
      },
      {
        $addFields: {
          optionsCount: {
            $arrayElemAt: ['$optionsCount', 0],
          },
        },
      },
      {
        $addFields: {
          optionsCount: '$optionsCount.counter',
        },
      },
    ])
    .toArray();

  const optionsGroups: OptionsGroupInterface[] = optionsGroupsAggregationResult.map(
    (optionsGroup) => {
      return {
        ...optionsGroup,
        name: getFieldStringLocale(optionsGroup.nameI18n, props.sessionLocale),
        variantName: getConstantTranslation(
          `selectsOptions.optionsGroupVariant.${optionsGroup.variant}.${props.sessionLocale}`,
        ),
      };
    },
  );

  return {
    props: {
      ...props,
      optionsGroups: castDbData(optionsGroups),
    },
  };
};

export default OptionsGroupsPage;
