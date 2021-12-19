import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import PromoDetails, {
  PromoDetailsInterface,
} from '../../../../../../components/Promo/PromoDetails';
import { ROUTE_CONSOLE } from '../../../../../../config/common';
import { AppContentWrapperBreadCrumbs, CompanyInterface } from '../../../../../../db/uiInterfaces';
import ConsoleLayout from '../../../../../../layout/cms/ConsoleLayout';
import ConsolePromoLayout from '../../../../../../layout/console/ConsolePromoLayout';
import { getPromoSsr } from '../../../../../../lib/promoUtils';
import {
  castDbData,
  getConsoleInitialData,
  GetConsoleInitialDataPropsInterface,
} from '../../../../../../lib/ssrUtils';

interface PromoDetailsPageInterface
  extends GetConsoleInitialDataPropsInterface,
    PromoDetailsInterface {
  pageCompany: CompanyInterface;
}

const PromoListPage: NextPage<PromoDetailsPageInterface> = ({
  layoutProps,
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
    <ConsoleLayout title={`${promo.name}`} {...layoutProps}>
      <ConsolePromoLayout promo={promo} basePath={basePath} breadcrumbs={breadcrumbs}>
        <PromoDetails basePath={basePath} pageCompany={pageCompany} promo={promo} />
      </ConsolePromoLayout>
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PromoDetailsPageInterface>> => {
  const { query } = context;
  const { props } = await getConsoleInitialData({ context });
  if (!props) {
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
      basePath: `${ROUTE_CONSOLE}/${props.layoutProps.pageCompany._id}/promo/details/${promo._id}`,
      promo: castDbData(promo),
      pageCompany: props.layoutProps.pageCompany,
    },
  };
};

export default PromoListPage;
