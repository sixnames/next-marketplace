import Table, { TableColumn } from 'components/Table/Table';
import { SORT_ASC } from 'config/common';
import { COL_PAGES_GROUP } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { PagesGroupInterface } from 'db/uiInterfaces';
import AppContentWrapper from 'layout/AppLayout/AppContentWrapper';
import { getFieldStringLocale } from 'lib/i18n';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import Inner from 'components/Inner/Inner';
import Title from 'components/Title/Title';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';

const pageTitle = 'Группы страниц';

interface PageGroupsPageConsumerInterface {
  pagesGroups: PagesGroupInterface[];
}

const PageGroupsPageConsumer: React.FC<PageGroupsPageConsumerInterface> = ({ pagesGroups }) => {
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
  ];

  return (
    <AppContentWrapper>
      <Inner>
        <Title>{pageTitle}</Title>
        <Table<PagesGroupInterface> columns={columns} data={pagesGroups} />
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
