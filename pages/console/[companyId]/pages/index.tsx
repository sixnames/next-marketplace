import Button from 'components/Button';
import FixedButtons from 'components/FixedButtons';
import ContentItemControls from 'components/ContentItemControls/ContentItemControls';
import Link from 'components/Link/Link';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import { PagesGroupModalInterface } from 'components/Modal/PagesGroupModal';
import Table, { TableColumn } from 'components/Table';
import { DEFAULT_COMPANY_SLUG, ROUTE_CONSOLE, SORT_ASC } from 'config/common';
import { CONFIRM_MODAL, PAGES_GROUP_MODAL } from 'config/modalVariants';
import { COL_PAGES_GROUP } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { CompanyInterface, PagesGroupInterface } from 'db/uiInterfaces';
import { useDeletePagesGroupMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import AppContentWrapper from 'layout/AppLayout/AppContentWrapper';
import AppLayout from 'layout/AppLayout/AppLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import Inner from 'components/Inner';
import Title from 'components/Title';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getConsoleInitialData } from 'lib/ssrUtils';
import { createPagesGroupSchema, updatePagesGroupSchema } from 'validation/pagesSchema';

const pageTitle = 'Группы страниц';

interface PageGroupsPageConsumerInterface {
  pagesGroups: PagesGroupInterface[];
  currentCompany: CompanyInterface;
}

const PageGroupsPageConsumer: React.FC<PageGroupsPageConsumerInterface> = ({
  pagesGroups,
  currentCompany,
}) => {
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
      render: ({ cellData, dataItem }) => {
        return (
          <Link
            testId={`${cellData}-link`}
            className='text-primary-text hover:no-underline hover:text-link-text'
            href={`${ROUTE_CONSOLE}/${currentCompany._id}/pages/${dataItem._id}`}
          >
            {cellData}
          </Link>
        );
      },
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
                    companySlug: DEFAULT_COMPANY_SLUG,
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
                    message: `Вы уверенны, что хотите удалить группу страниц ${dataItem.name}. Все страницы данной группы будту так же удалены.`,
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
    <AppContentWrapper testId={'page-groups-list'}>
      <Inner>
        <Title>{pageTitle}</Title>
        <div className='relative'>
          <div className='overflow-x-auto overflow-y-hidden'>
            <Table<PagesGroupInterface>
              testIdKey={'name'}
              columns={columns}
              data={pagesGroups}
              onRowDoubleClick={(dataItem) => {
                router
                  .push(`${ROUTE_CONSOLE}/${currentCompany._id}/pages/${dataItem._id}`)
                  .catch(console.log);
              }}
            />
          </div>

          <FixedButtons>
            <Button
              testId={'create-pages-group'}
              size={'small'}
              onClick={() => {
                showModal<PagesGroupModalInterface>({
                  variant: PAGES_GROUP_MODAL,
                  props: {
                    companySlug: `${currentCompany?.slug}`,
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

const PageGroupsPage: NextPage<PageGroupsPageInterface> = ({
  pageUrls,
  pagesGroups,
  currentCompany,
}) => {
  return (
    <AppLayout title={pageTitle} pageUrls={pageUrls}>
      <PageGroupsPageConsumer pagesGroups={pagesGroups} currentCompany={currentCompany} />
    </AppLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PageGroupsPageInterface>> => {
  const { props } = await getConsoleInitialData({ context });
  if (!props || !props.currentCompany) {
    return {
      notFound: true,
    };
  }

  const { db } = await getDatabase();
  const pagesGroupsCollection = db.collection<PagesGroupInterface>(COL_PAGES_GROUP);

  const pagesGroupsAggregationResult = await pagesGroupsCollection
    .aggregate([
      {
        $match: {
          companySlug: props.currentCompany.slug,
        },
      },
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
      currentCompany: props.currentCompany,
    },
  };
};

export default PageGroupsPage;
