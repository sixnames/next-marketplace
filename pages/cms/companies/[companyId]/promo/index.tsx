import Inner from 'components/Inner';
import CmsCompanyLayout from 'components/layout/cms/CmsCompanyLayout';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import PromoList, { PromoListInterface } from 'components/Promo/PromoList';
import { getDbCollections } from 'db/mongodb';
import { AppContentWrapperBreadCrumbs } from 'db/uiInterfaces';
import { getProjectLinks } from 'lib/links/getProjectLinks';

import { getPromoListSsr } from 'lib/promoUtils';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

const pageTitle = 'Акции';

interface PromoListPageInterface extends GetAppInitialDataPropsInterface, PromoListInterface {}

const PromoListPage: NextPage<PromoListPageInterface> = ({
  layoutProps,
  promoList,
  pageCompany,
}) => {
  const links = getProjectLinks({
    companyId: pageCompany._id,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: pageTitle,
    config: [
      {
        name: 'Компании',
        href: links.cms.companies.url,
      },
      {
        name: pageCompany.name,
        href: links.cms.companies.companyId.url,
      },
    ],
  };

  return (
    <ConsoleLayout title={pageTitle} {...layoutProps}>
      <CmsCompanyLayout company={pageCompany} breadcrumbs={breadcrumbs}>
        <Inner>
          <PromoList promoList={promoList} pageCompany={pageCompany} />
        </Inner>
      </CmsCompanyLayout>
    </ConsoleLayout>
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

  const collections = await getDbCollections();
  const companiesCollection = collections.companiesCollection();
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
      pageCompany: castDbData(company),
      promoList: castDbData(promoList),
    },
  };
};

export default PromoListPage;
