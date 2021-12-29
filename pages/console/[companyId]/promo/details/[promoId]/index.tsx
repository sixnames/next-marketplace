import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import PromoDetails, {
  PromoDetailsInterface,
} from '../../../../../../components/Promo/PromoDetails';
import { AppContentWrapperBreadCrumbs, CompanyInterface } from '../../../../../../db/uiInterfaces';
import ConsoleLayout from '../../../../../../layout/cms/ConsoleLayout';
import ConsolePromoLayout from '../../../../../../layout/console/ConsolePromoLayout';
import { getConsoleCompanyLinks } from '../../../../../../lib/linkUtils';
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
  const links = getConsoleCompanyLinks({
    companyId: pageCompany._id,
    promoId: promo._id,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${promo.name}`,
    config: [
      {
        name: 'Акции',
        href: links.promo.parentLink,
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

  const links = getConsoleCompanyLinks({
    companyId: props.layoutProps.pageCompany._id,
    promoId: promo._id,
  });

  return {
    props: {
      ...props,
      basePath: links.promo.parentLink,
      promo: castDbData(promo),
      pageCompany: props.layoutProps.pageCompany,
    },
  };
};

export default PromoListPage;
