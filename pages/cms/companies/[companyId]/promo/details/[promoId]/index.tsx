import PromoDetails, { PromoDetailsInterface } from 'components/Promo/PromoDetails';
import { ROUTE_CMS } from 'config/common';
import { COL_COMPANIES } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { CompanyInterface } from 'db/uiInterfaces';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsCompanyLayout from 'layout/cms/CmsCompanyLayout';
import CmsLayout from 'layout/cms/CmsLayout';
import { getPromoSsr } from 'lib/promoUtils';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';

interface PromoDetailsPageInterface extends PagePropsInterface, PromoDetailsInterface {
  currentCompany: CompanyInterface;
}

const PromoDetailsPage: React.FC<PromoDetailsPageInterface> = ({
  pageUrls,
  promo,
  currentCompany,
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
        name: currentCompany.name,
        href: `${ROUTE_CMS}/companies/${currentCompany._id}`,
      },
      {
        name: 'Акции',
        href: `${ROUTE_CMS}/companies/${currentCompany._id}/promo`,
      },
    ],
  };

  return (
    <CmsLayout title={`${promo.name}`} pageUrls={pageUrls}>
      <CmsCompanyLayout company={currentCompany} breadcrumbs={breadcrumbs}>
        <PromoDetails basePath={basePath} currentCompany={currentCompany} promo={promo} />
      </CmsCompanyLayout>
    </CmsLayout>
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
      currentCompany: castDbData(company),
      promo: castDbData(promo),
    },
  };
};

export default PromoDetailsPage;
