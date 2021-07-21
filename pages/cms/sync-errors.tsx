import Inner from 'components/Inner';
import SyncErrorsList, { SyncErrorsListInterface } from 'components/SyncErrorsList';
import Title from 'components/Title';
import { COL_NOT_SYNCED_PRODUCTS, COL_SHOPS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { NotSyncedProductInterface } from 'db/uiInterfaces';
import AppContentWrapper from 'layout/AppContentWrapper';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';

const pageTitle = 'Ошибки синхронизации';

type CompanyShopSyncErrorsConsumerInterface = SyncErrorsListInterface;

const CompanyShopSyncErrorsConsumer: React.FC<CompanyShopSyncErrorsConsumerInterface> = ({
  notSyncedProducts,
}) => {
  return (
    <AppContentWrapper>
      <Inner testId={'sync-errors-page'}>
        <Title>{pageTitle}</Title>
        <SyncErrorsList notSyncedProducts={notSyncedProducts} />
      </Inner>
    </AppContentWrapper>
  );
};

interface CompanyShopSyncErrorsInterface
  extends PagePropsInterface,
    CompanyShopSyncErrorsConsumerInterface {}

const CompanyShopSyncErrors: NextPage<CompanyShopSyncErrorsInterface> = ({
  pageUrls,
  notSyncedProducts,
}) => {
  return (
    <CmsLayout pageUrls={pageUrls} title={pageTitle}>
      <CompanyShopSyncErrorsConsumer notSyncedProducts={notSyncedProducts} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CompanyShopSyncErrorsInterface>> => {
  const { db } = await getDatabase();
  const notSyncedProductsCollection =
    db.collection<NotSyncedProductInterface>(COL_NOT_SYNCED_PRODUCTS);
  const initialProps = await getAppInitialData({ context });

  if (!initialProps.props) {
    return {
      notFound: true,
    };
  }

  const notSyncedProducts = await notSyncedProductsCollection
    .aggregate([
      {
        $lookup: {
          from: COL_SHOPS,
          as: 'shop',
          foreignField: '_id',
          localField: 'shopId',
        },
      },
      {
        $addFields: {
          shop: {
            $arrayElemAt: ['$shop', 0],
          },
        },
      },
    ])
    .toArray();

  const filteredNotSyncedProducts = notSyncedProducts.filter(({ shop }) => {
    return Boolean(shop);
  });

  return {
    props: {
      ...initialProps.props,
      notSyncedProducts: castDbData(filteredNotSyncedProducts),
    },
  };
};

export default CompanyShopSyncErrors;
