import Head from 'next/head';
import { useRouter } from 'next/router';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import ContentItemControls from 'components/button/ContentItemControls';
import FixedButtons from 'components/button/FixedButtons';
import WpButton from 'components/button/WpButton';
import Inner from 'components/Inner';
import { OptionsGroupModalInterface } from 'components/Modal/OptionsGroupModal';
import WpTable, { WpTableColumn } from 'components/WpTable';
import WpTitle from 'components/WpTitle';
import { DEFAULT_LOCALE, SORT_ASC } from 'lib/config/common';
import { getConstantTranslation } from 'lib/config/constantTranslations';
import { CONFIRM_MODAL, OPTIONS_GROUP_MODAL } from 'lib/config/modalVariants';
import { COL_OPTIONS, COL_OPTIONS_GROUPS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { OptionsGroupInterface } from 'db/uiInterfaces';
import {
  useCreateOptionsGroupMutation,
  useDeleteOptionsGroupMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { getFieldStringLocale } from 'lib/i18n';
import { noNaN } from 'lib/numbers';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';

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

  const columns: WpTableColumn<OptionsGroupInterface>[] = [
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
                const links = getProjectLinks({
                  optionsGroupId: dataItem._id,
                });
                router.push(links.cms.options.optionsGroupId.options.url).catch(console.log);
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
        <WpTitle>{pageTitle}</WpTitle>

        <div className='relative'>
          <div className='overflow-x-auto overflow-y-hidden'>
            <WpTable<OptionsGroupInterface>
              testIdKey={'name'}
              columns={columns}
              data={optionsGroups}
              onRowDoubleClick={(dataItem) => {
                const links = getProjectLinks({
                  optionsGroupId: dataItem._id,
                });
                router.push(links.cms.options.optionsGroupId.options.url).catch(console.log);
              }}
            />
          </div>
          <FixedButtons>
            <WpButton
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
            </WpButton>
          </FixedButtons>
        </div>
      </Inner>
    </AppContentWrapper>
  );
};

interface OptionsGroupsPageInterface
  extends GetAppInitialDataPropsInterface,
    OptionsGroupsConsumerInterface {}

const OptionsGroupsPage: NextPage<OptionsGroupsPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <OptionsGroupsConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<OptionsGroupsPageInterface>> => {
  const { props } = await getAppInitialData({ context });

  if (!props) {
    return {
      notFound: true,
    };
  }

  const { db } = await getDatabase();
  const optionsGroupsCollection = await db.collection<OptionsGroupInterface>(COL_OPTIONS_GROUPS);

  const optionsGroupsAggregationResult = await optionsGroupsCollection
    .aggregate<OptionsGroupInterface>([
      {
        $sort: {
          [`nameI18n.${DEFAULT_LOCALE}`]: SORT_ASC,
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
