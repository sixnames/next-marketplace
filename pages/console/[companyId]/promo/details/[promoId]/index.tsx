import PromoDetails, { PromoDetailsInterface } from 'components/Promo/PromoDetails';
import { ROUTE_CONSOLE } from 'config/common';
import { CompanyInterface } from 'db/uiInterfaces';
import AppContentWrapper, { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import ConsoleLayout from 'layout/console/ConsoleLayout';
import { getPromoSsr } from 'lib/promoUtils';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getConsoleInitialData } from 'lib/ssrUtils';

interface PromoDetailsPageInterface extends PagePropsInterface, PromoDetailsInterface {
  pageCompany: CompanyInterface;
}

const PromoListPage: NextPage<PromoDetailsPageInterface> = ({
  pageUrls,
  promo,
  pageCompany,
  basePath,
}) => {
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${promo.name}`,
    config: [
      {
        name: 'Акции',
        href: `${ROUTE_CONSOLE}/${pageCompany._id}/promo`,
      },
    ],
  };

  return (
    <ConsoleLayout title={`${promo.name}`} pageUrls={pageUrls} company={pageCompany}>
      <AppContentWrapper breadcrumbs={breadcrumbs}>
        <PromoDetails basePath={basePath} currentCompany={pageCompany} promo={promo} />
      </AppContentWrapper>
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PromoDetailsPageInterface>> => {
  const { query } = context;
  const { props } = await getConsoleInitialData({ context });
  if (!props || !props.pageCompany) {
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
      basePath: `${ROUTE_CONSOLE}/${props.pageCompany._id}/promo/details/${promo._id}`,
      promo: castDbData(promo),
      pageCompany: props.pageCompany,
    },
  };
};

export default PromoListPage;
