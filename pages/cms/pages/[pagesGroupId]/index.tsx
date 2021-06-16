import Button from 'components/Buttons/Button';
import FixedButtons from 'components/Buttons/FixedButtons';
import Table, { TableColumn } from 'components/Table/Table';
import { PAGE_STATE_DRAFT, ROUTE_CMS, SORT_ASC } from 'config/common';
import { COL_PAGES, COL_PAGES_GROUP } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { PageInterface, PagesGroupInterface } from 'db/uiInterfaces';
import AppContentWrapper from 'layout/AppLayout/AppContentWrapper';
import { getFieldStringLocale } from 'lib/i18n';
import { ObjectId } from 'mongodb';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import Inner from 'components/Inner/Inner';
import Title from 'components/Title/Title';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';

interface PagesListPageConsumerInterface {
  pagesGroup: PagesGroupInterface;
}

const PagesListPageConsumer: React.FC<PagesListPageConsumerInterface> = ({ pagesGroup }) => {
  const router = useRouter();

  const columns: TableColumn<PageInterface>[] = [
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
      accessor: 'state',
      headTitle: 'Опубликована',
      render: ({ cellData }) => (cellData === PAGE_STATE_DRAFT ? 'Нет' : 'Да'),
    },
  ];

  return (
    <AppContentWrapper>
      <Inner>
        <Title>{pagesGroup.name}</Title>
        <div className='relative'>
          <div className='overflow-x-auto overflow-y-hidden'>
            <Table<PageInterface>
              testIdKey={'name'}
              columns={columns}
              data={pagesGroup.pages || []}
              onRowDoubleClick={(dataItem) => {
                router
                  .push(`${ROUTE_CMS}/pages/${pagesGroup._id}/${dataItem._id}`)
                  .catch(console.log);
              }}
            />
          </div>

          <FixedButtons>
            <Button
              size={'small'}
              /*onClick={() => {
                showModal<PagesGroupModalInterface>({
                  variant: PAGES_GROUP_MODAL,
                  props: {
                    validationSchema: createPagesGroupValidationSchema,
                  },
                });
              }}*/
            >
              Добавить страницу
            </Button>
          </FixedButtons>
        </div>
      </Inner>
    </AppContentWrapper>
  );
};

interface PagesListPageInterface extends PagePropsInterface, PagesListPageConsumerInterface {}

const PagesListPage: NextPage<PagesListPageInterface> = ({ pageUrls, pagesGroup }) => {
  return (
    <CmsLayout title={`${pagesGroup.name}`} pageUrls={pageUrls}>
      <PagesListPageConsumer pagesGroup={pagesGroup} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PagesListPageInterface>> => {
  const { query } = context;
  const { pagesGroupId } = query;
  const { props } = await getAppInitialData({ context });
  if (!props || !pagesGroupId) {
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
          _id: new ObjectId(`${pagesGroupId}`),
        },
      },
      {
        $lookup: {
          from: COL_PAGES,
          as: 'pages',
          let: {
            pagesGroupId: '$_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$pagesGroupId', '$$pagesGroupId'],
                },
              },
            },
            {
              $sort: {
                index: SORT_ASC,
              },
            },
            {
              $project: {
                content: false,
              },
            },
          ],
        },
      },
    ])
    .toArray();

  const pagesGroups: PagesGroupInterface[] = pagesGroupsAggregationResult.map((pagesGroup) => {
    return {
      ...pagesGroup,
      name: getFieldStringLocale(pagesGroup.nameI18n, props.sessionLocale),
      pages: (pagesGroup.pages || []).map((page) => {
        return {
          ...page,
          name: getFieldStringLocale(page.nameI18n, props.sessionLocale),
        };
      }),
    };
  });

  const pagesGroup = pagesGroups[0];
  if (!pagesGroup) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...props,
      pagesGroup: castDbData(pagesGroup),
    },
  };
};

export default PagesListPage;
