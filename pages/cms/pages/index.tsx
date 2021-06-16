import Button from 'components/Buttons/Button';
import FixedButtons from 'components/Buttons/FixedButtons';
import ContentItemControls from 'components/ContentItemControls/ContentItemControls';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal/ConfirmModal';
import { PagesGroupModalInterface } from 'components/Modal/PagesGroupModal';
import Table, { TableColumn } from 'components/Table/Table';
import { ROUTE_CMS, SORT_ASC } from 'config/common';
import { CONFIRM_MODAL, PAGES_GROUP_MODAL } from 'config/modalVariants';
import { COL_PAGES_GROUP } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { PagesGroupInterface } from 'db/uiInterfaces';
import { useDeletePagesGroupMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import AppContentWrapper from 'layout/AppLayout/AppContentWrapper';
import { getFieldStringLocale } from 'lib/i18n';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import Inner from 'components/Inner/Inner';
import Title from 'components/Title/Title';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { createPagesGroupSchema, updatePagesGroupSchema } from 'validation/pagesSchema';

const pageTitle = 'Группы страниц';

interface PageGroupsPageConsumerInterface {
  pagesGroups: PagesGroupInterface[];
}

const PageGroupsPageConsumer: React.FC<PageGroupsPageConsumerInterface> = ({ pagesGroups }) => {
  const router = useRouter();
  const { showLoading, showModal, onCompleteCallback, onErrorCallback } = useMutationCallbacks({
    reload: true,
  });

  const createPagesGroupValidationSchema = useValidationSchema({
    schema: createPagesGroupSchema,
  });

  const updatePagesGroupValidationSchema = useValidationSchema({
    schema: updatePagesGroupSchema,
  });

  const [deletePagesGroupMutation] = useDeletePagesGroupMutation({
    onCompleted: (data) => onCompleteCallback(data.deletePagesGroup),
    onError: onErrorCallback,
  });

  const columns: TableColumn<PagesGroupInterface>[] = [
    {
      accessor: 'name',
      headTitle: 'Название',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'index',
      headTitle: 'Порядковый номер',
      render: ({ cellData }) => cellData,
    },
    {
      render: ({ dataItem }) => {
        return (
          <div className='flex justify-end'>
            <ContentItemControls
              testId={`${dataItem.name}`}
              updateTitle={'Обновить группу страниц'}
              updateHandler={() => {
                showModal<PagesGroupModalInterface>({
                  variant: PAGES_GROUP_MODAL,
                  props: {
                    validationSchema: updatePagesGroupValidationSchema,
                    pagesGroup: dataItem,
                  },
                });
              }}
              deleteTitle={'Удалить группу страниц'}
              deleteHandler={() => {
                showModal<ConfirmModalInterface>({
                  variant: CONFIRM_MODAL,
                  props: {
                    testId: 'delete-pages-group-modal',
                    message: `Вы уверенны, что хотите удалить группу старниц ${dataItem.name}. Все страницы данной группы будту так же удалены.`,
                    confirm: () => {
                      showLoading();
                      deletePagesGroupMutation({
                        variables: {
                          _id: dataItem._id,
                        },
                      }).catch(console.log);
                    },
                  },
                });
              }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <AppContentWrapper>
      <Inner>
        <Title>{pageTitle}</Title>
        <div className='relative'>
          <div className='overflow-x-auto overflow-y-hidden'>
            <Table<PagesGroupInterface>
              testIdKey={'name'}
              columns={columns}
              data={pagesGroups}
              onRowDoubleClick={(dataItem) => {
                router.push(`${ROUTE_CMS}/pages/${dataItem._id}`).catch(console.log);
              }}
            />
          </div>

          <FixedButtons>
            <Button
              size={'small'}
              onClick={() => {
                showModal<PagesGroupModalInterface>({
                  variant: PAGES_GROUP_MODAL,
                  props: {
                    validationSchema: createPagesGroupValidationSchema,
                  },
                });
              }}
            >
              Добавить группу страниц
            </Button>
          </FixedButtons>
        </div>
      </Inner>
    </AppContentWrapper>
  );
};

interface PageGroupsPageInterface extends PagePropsInterface, PageGroupsPageConsumerInterface {}

const PageGroupsPage: NextPage<PageGroupsPageInterface> = ({ pageUrls, pagesGroups }) => {
  return (
    <CmsLayout title={pageTitle} pageUrls={pageUrls}>
      <PageGroupsPageConsumer pagesGroups={pagesGroups} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PageGroupsPageInterface>> => {
  const { props } = await getAppInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const { db } = await getDatabase();
  const pagesGroupsCollection = db.collection<PagesGroupInterface>(COL_PAGES_GROUP);

  const pagesGroupsAggregationResult = await pagesGroupsCollection
    .aggregate([
      {
        $sort: {
          index: SORT_ASC,
        },
      },
    ])
    .toArray();

  const pagesGroups: PagesGroupInterface[] = pagesGroupsAggregationResult.map((pagesGroup) => {
    return {
      ...pagesGroup,
      name: getFieldStringLocale(pagesGroup.nameI18n, props.sessionLocale),
    };
  });

  return {
    props: {
      ...props,
      pagesGroups: castDbData(pagesGroups),
    },
  };
};

export default PageGroupsPage;
