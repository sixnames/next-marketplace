import PromoList, { PromoListInterface } from 'components/Promo/PromoList';
import { ROUTE_CMS } from 'config/common';
import { COL_COMPANIES } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { CompanyInterface } from 'db/uiInterfaces';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsCompanyLayout from 'layout/cms/CmsCompanyLayout';
import { getPromoListSsr } from 'lib/promoUtils';
import { ObjectId } from 'mongodb';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import CmsLayout from 'layout/cms/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';

const pageTitle = 'Акции';

interface PromoListPageInterface extends PagePropsInterface, PromoListInterface {
  currentCompany: CompanyInterface;
}

const PromoListPage: NextPage<PromoListPageInterface> = ({
  pageUrls,
  promoList,
  currentCompany,
}) => {
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: pageTitle,
    config: [
      {
        name: 'Компании',
        href: `${ROUTE_CMS}/companies`,
      },
      {
        name: currentCompany.name,
        href: `${ROUTE_CMS}/companies/${currentCompany._id}`,
      },
    ],
  };

  return (
    <CmsLayout title={pageTitle} pageUrls={pageUrls}>
      <CmsCompanyLayout company={currentCompany} breadcrumbs={breadcrumbs}>
        <PromoList promoList={promoList} currentCompany={currentCompany} />
      </CmsCompanyLayout>
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PromoListPageInterface>> => {
  const { query } = context;
  const { props } = await getAppInitialData({ context });
  if (!props || !query.companyId) {
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

  const promoList = await getPromoListSsr({
    locale: props.sessionLocale,
    companyId: company._id.toHexString(),
  });

  return {
    props: {
      ...props,
      currentCompany: castDbData(company),
      promoList: castDbData(promoList),
    },
  };
};

export default PromoListPage;
