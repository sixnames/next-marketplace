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
  currentCompany: CompanyInterface;
}

const PromoListPage: NextPage<PromoDetailsPageInterface> = ({
  pageUrls,
  promo,
  currentCompany,
  basePath,
}) => {
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${promo.name}`,
    config: [
      {
        name: 'Акции',
        href: `${ROUTE_CONSOLE}/${currentCompany._id}/promo`,
      },
    ],
  };

  return (
    <ConsoleLayout title={`${promo.name}`} pageUrls={pageUrls} company={currentCompany}>
      <AppContentWrapper breadcrumbs={breadcrumbs}>
        <PromoDetails basePath={basePath} currentCompany={currentCompany} promo={promo} />
      </AppContentWrapper>
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PromoDetailsPageInterface>> => {
  const { query } = context;
  const { props } = await getConsoleInitialData({ context });
  if (!props || !props.currentCompany) {
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
      basePath: `${ROUTE_CONSOLE}/${props.currentCompany._id}/promo/details/${promo._id}`,
      promo: castDbData(promo),
      currentCompany: props.currentCompany,
    },
  };
};

export default PromoListPage;
