import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import ShopDetails, { ShopDetailsInterface } from 'components/shops/ShopDetails';
import { COL_COMPANIES } from 'db/collectionNames';
import { getDbCollections } from 'db/mongodb';
import { AppContentWrapperBreadCrumbs } from 'db/uiInterfaces';
import { getCmsCompanyLinks } from 'lib/linkUtils';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

interface CompanyShopInterface
  extends GetAppInitialDataPropsInterface,
    Omit<ShopDetailsInterface, 'basePath'> {}

const CompanyShop: NextPage<CompanyShopInterface> = ({ layoutProps, shop }) => {
  const links = getCmsCompanyLinks({
    companyId: shop.companyId,
    shopId: shop._id,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: shop.name,
    config: [
      {
        name: 'Компании',
        href: links.parentLink,
      },
      {
        name: `${shop.company?.name}`,
        href: links.root,
      },
      {
        name: 'Магазины',
        href: links.shop.parentLink,
      },
    ],
  };

  return (
    <ConsoleLayout {...layoutProps}>
      <ShopDetails shop={shop} breadcrumbs={breadcrumbs} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CompanyShopInterface>> => {
  const collections = await getDbCollections();
  const shopsCollection = collections.shopsCollection();
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

  return {
    props: {
      ...initialProps.props,
      shop: castDbData(shop),
    },
  };
};

export default CompanyShop;
