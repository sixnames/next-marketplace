import { ROUTE_CMS } from 'config/common';
import { COL_COMPANIES } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  CompanyInterface,
  PromoInterface,
  ShopProductInterface,
} from 'db/uiInterfaces';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import ConsolePromoLayout from 'layout/console/ConsolePromoLayout';
import { getPromoSsr } from 'lib/promoUtils';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';

export interface ConsolePromoProductsInterface {
  promo: PromoInterface;
  basePath: string;
  pageCompany: CompanyInterface;
  shopProducts: ShopProductInterface[];
}

const ConsolePromoProducts: React.FC<ConsolePromoProductsInterface> = () => {
  return <div />;
};

interface PromoDetailsPageInterface
  extends GetAppInitialDataPropsInterface,
    ConsolePromoProductsInterface {}

const PromoDetailsPage: React.FC<PromoDetailsPageInterface> = ({
  layoutProps,
  promo,
  pageCompany,
  basePath,
  shopProducts,
}) => {
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Товары`,
    config: [
      {
        name: 'Компании',
        href: `${ROUTE_CMS}/companies`,
      },
      {
        name: pageCompany.name,
        href: `${ROUTE_CMS}/companies/${pageCompany._id}`,
      },
      {
        name: 'Акции',
        href: `${ROUTE_CMS}/companies/${pageCompany._id}/promo`,
      },
      {
        name: `${promo.name}`,
        href: `${ROUTE_CMS}/companies/${pageCompany._id}/promo/details/${promo._id}`,
      },
    ],
  };

  return (
    <ConsoleLayout title={`${promo.name}`} {...layoutProps}>
      <ConsolePromoLayout basePath={basePath} promo={promo} breadcrumbs={breadcrumbs}>
        <ConsolePromoProducts
          basePath={basePath}
          pageCompany={pageCompany}
          shopProducts={shopProducts}
          promo={promo}
        />
      </ConsolePromoLayout>
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PromoDetailsPageInterface>> => {
  const { query } = context;
  const { props } = await getAppInitialData({ context });
  if (!props || !query.companyId || !query.promoId) {
    return {
      notFound: true,
    };
  }

  const { db } = await getDatabase();
  const companiesCollection = db.collection<CompanyInterface>(COL_COMPANIES);
  const company = await companiesCollection.findOne({
    _id: new ObjectId(`${query.companyId}`),
  });
  if (!company) {
    return {
      notFound: true,
    };
  }

  const promo = await getPromoSsr({
    locale: props.sessionLocale,
    promoId: `${query.promoId}`,
  });
  if (!promo) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...props,
      basePath: `${ROUTE_CMS}/companies/${company._id}/promo/details/${promo._id}`,
      pageCompany: castDbData(company),
      promo: castDbData(promo),
      shopProducts: [],
    },
  };
};

export default PromoDetailsPage;
