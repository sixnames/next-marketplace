import PromoDetails, { PromoDetailsInterface } from 'components/Promo/PromoDetails';
import { ROUTE_CMS } from 'config/common';
import { COL_COMPANIES } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { CompanyInterface } from 'db/uiInterfaces';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsCompanyLayout from 'layout/cms/CmsCompanyLayout';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import { getPromoSsr } from 'lib/promoUtils';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';

interface PromoDetailsPageInterface
  extends GetAppInitialDataPropsInterface,
    PromoDetailsInterface {}

const PromoDetailsPage: React.FC<PromoDetailsPageInterface> = ({
  layoutProps,
  promo,
  pageCompany,
  basePath,
}) => {
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${promo.name}`,
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
    ],
  };

  return (
    <ConsoleLayout title={`${promo.name}`} {...layoutProps}>
      <CmsCompanyLayout company={pageCompany} breadcrumbs={breadcrumbs}>
        <PromoDetails basePath={basePath} pageCompany={pageCompany} promo={promo} />
      </CmsCompanyLayout>
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
    },
  };
};

export default PromoDetailsPage;
