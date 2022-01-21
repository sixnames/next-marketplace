import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';
import ConsolePromoCodeList, {
  ConsolePromoCodeListInterface,
} from '../../../../../../../components/console/ConsolePromoCodeList';
import { COL_PROMO_CODES } from '../../../../../../../db/collectionNames';
import { PromoCodeModel } from '../../../../../../../db/dbModels';
import { getDatabase } from '../../../../../../../db/mongodb';
import { AppContentWrapperBreadCrumbs } from '../../../../../../../db/uiInterfaces';
import ConsoleLayout from '../../../../../../../layout/cms/ConsoleLayout';
import ConsolePromoLayout from '../../../../../../../layout/console/ConsolePromoLayout';
import { getConsoleCompanyLinks } from '../../../../../../../lib/linkUtils';
import { getPromoSsr } from '../../../../../../../lib/promoUtils';
import {
  castDbData,
  GetAppInitialDataPropsInterface,
  getConsoleInitialData,
} from '../../../../../../../lib/ssrUtils';

interface PromoCodeListPageInterface
  extends GetAppInitialDataPropsInterface,
    ConsolePromoCodeListInterface {}

const PromoCodeListPage: React.FC<PromoCodeListPageInterface> = ({
  layoutProps,
  promo,
  pageCompany,
  promoCodes,
}) => {
  const links = getConsoleCompanyLinks({
    companyId: pageCompany._id,
    promoId: promo._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Промо-коды`,
    config: [
      {
        name: 'Акции',
        href: links.promo.parentLink,
      },
      {
        name: `${promo.name}`,
        href: links.promo.root,
      },
    ],
  };

  return (
    <ConsoleLayout title={`${promo.name}`} {...layoutProps}>
      <ConsolePromoLayout promo={promo} basePath={links.parentLink} breadcrumbs={breadcrumbs}>
        <ConsolePromoCodeList
          basePath={links.parentLink}
          pageCompany={pageCompany}
          promo={promo}
          promoCodes={promoCodes}
        />
      </ConsolePromoLayout>
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PromoCodeListPageInterface>> => {
  const { db } = await getDatabase();
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

  const promoCodesCollection = db.collection<PromoCodeModel>(COL_PROMO_CODES);
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
