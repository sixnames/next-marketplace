import ShopSyncErrors, { ShopSyncErrorsInterface } from 'components/shops/ShopSyncErrors';
import { DEFAULT_COMPANY_SLUG, ROUTE_CMS } from 'config/common';
import { COL_COMPANIES, COL_SHOPS } from 'db/collectionNames';
import { getPaginatedNotSyncedProducts } from 'db/dao/notSyncedProducts/getPaginatedNotSyncedProducts';
import { ShopModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsLayout from 'layout/cms/CmsLayout';
import { alwaysArray, alwaysString } from 'lib/arrayUtils';
import { ObjectId } from 'mongodb';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';

interface CompanyShopSyncErrorsInterface
  extends PagePropsInterface,
    Omit<ShopSyncErrorsInterface, 'basePath'> {}

const CompanyShopSyncErrors: NextPage<CompanyShopSyncErrorsInterface> = ({
  pageUrls,
  shop,
  notSyncedProducts,
  companySlug,
}) => {
  const companyBasePath = `${ROUTE_CMS}/companies/${shop.companyId}`;

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Ошибки синхронизации',
    config: [
      {
        name: 'Компании',
        href: `${ROUTE_CMS}/companies`,
      },
      {
        name: `${shop.company?.name}`,
        href: companyBasePath,
      },
      {
        name: 'Магазины',
        href: `${companyBasePath}/shops/${shop.companyId}`,
      },
      {
        name: shop.name,
        href: `${companyBasePath}/shops/shop/${shop._id}`,
      },
    ],
  };

  return (
    <CmsLayout pageUrls={pageUrls}>
      <ShopSyncErrors
        companySlug={companySlug}
        breadcrumbs={breadcrumbs}
        notSyncedProducts={notSyncedProducts}
        showShopName={false}
        basePath={`${companyBasePath}/shops/shop`}
        shop={shop}
      />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CompanyShopSyncErrorsInterface>> => {
  const { db } = await getDatabase();
  const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
  const { query } = context;
  const { shopId } = query;
  const initialProps = await getAppInitialData({ context });

  const shopAggregation = await shopsCollection
    .aggregate([
      {
        $match: { _id: new ObjectId(`${shopId}`) },
      },
      {
        $lookup: {
          from: COL_COMPANIES,
          as: 'company',
          foreignField: '_id',
          localField: 'companyId',
        },
      },
      {
        $addFields: {
          company: {
            $arrayElemAt: ['$company', 0],
          },
        },
      },
    ])
    .toArray();
  const shop = shopAggregation[0];

  if (!initialProps.props || !shop) {
    return {
      notFound: true,
    };
  }

  const payload = await getPaginatedNotSyncedProducts({
    filters: alwaysArray(query.filters),
    shopId: alwaysString(shopId),
  });

  return {
    props: {
      ...initialProps.props,
      shop: castDbData(shop),
      notSyncedProducts: castDbData(payload),
      companySlug: DEFAULT_COMPANY_SLUG,
    },
  };
};

export default CompanyShopSyncErrors;