import ConsolePromoCodeList, {
  ConsolePromoCodeListInterface,
} from 'components/console/ConsolePromoCodeList';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import ConsolePromoLayout from 'components/layout/console/ConsolePromoLayout';
import { getDbCollections } from 'db/mongodb';
import { AppContentWrapperBreadCrumbs } from 'db/uiInterfaces';
import { getProjectLinks } from 'lib/links/getProjectLinks';

import { getPromoSsr } from 'lib/promoUtils';
import { castDbData, GetAppInitialDataPropsInterface, getConsoleInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';

interface PromoCodeListPageInterface
  extends GetAppInitialDataPropsInterface,
    ConsolePromoCodeListInterface {}

const PromoCodeListPage: React.FC<PromoCodeListPageInterface> = ({
  layoutProps,
  promo,
  pageCompany,
  promoCodes,
}) => {
  const links = getProjectLinks({
    companyId: pageCompany._id,
    promoId: promo._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Промо-коды`,
    config: [
      {
        name: 'Акции',
        href: links.console.companyId.promo.url,
      },
      {
        name: `${promo.name}`,
        href: links.console.companyId.promo.details.promoId.url,
      },
    ],
  };

  return (
    <ConsoleLayout title={`${promo.name}`} {...layoutProps}>
      <ConsolePromoLayout promo={promo} breadcrumbs={breadcrumbs}>
        <ConsolePromoCodeList pageCompany={pageCompany} promo={promo} promoCodes={promoCodes} />
      </ConsolePromoLayout>
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PromoCodeListPageInterface>> => {
  const collections = await getDbCollections();
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

  const promoCodesCollection = collections.promoCodesCollection();
  const promoCodes = await promoCodesCollection
    .aggregate([
      {
        $match: {
          promoId: promo._id,
        },
      },
    ])
    .toArray();

  return {
    props: {
      ...props,
      pageCompany: props.layoutProps.pageCompany,
      promo: castDbData(promo),
      promoCodes: castDbData(promoCodes),
    },
  };
};

export default PromoCodeListPage;
