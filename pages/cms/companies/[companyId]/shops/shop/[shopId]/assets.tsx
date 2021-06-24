import { ROUTE_CMS } from 'config/common';
import { COL_SHOPS } from 'db/collectionNames';
import { ShopModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import ShopAssets, { ShopAssetsInterface } from 'components/shops/ShopAssets';

interface CompanyShopAssetsInterface
  extends PagePropsInterface,
    Omit<ShopAssetsInterface, 'basePath'> {}

const CompanyShopAssets: NextPage<CompanyShopAssetsInterface> = ({ pageUrls, shop }) => {
  const router = useRouter();

  return (
    <CmsLayout pageUrls={pageUrls}>
      <ShopAssets
        basePath={`${ROUTE_CMS}/companies/${router.query.companyId}/shops/shop`}
        shop={shop}
      />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CompanyShopAssetsInterface>> => {
  const { db } = await getDatabase();
  const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
  const { query } = context;
  const { shopId } = query;
  const initialProps = await getAppInitialData({ context });

  const shop = await shopsCollection.findOne({ _id: new ObjectId(`${shopId}`) });

  if (!initialProps.props || !shop) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...initialProps.props,
      shop: castDbData(shop),
    },
  };
};

export default CompanyShopAssets;
