import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';
import ConsolePromoCodeList, {
  ConsolePromoCodeListInterface,
} from '../../../../../../../../components/console/ConsolePromoCodeList';
import { COL_COMPANIES, COL_PROMO_CODES } from '../../../../../../../../db/collectionNames';
import { PromoCodeModel } from '../../../../../../../../db/dbModels';
import { getDatabase } from '../../../../../../../../db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  CompanyInterface,
} from '../../../../../../../../db/uiInterfaces';
import ConsoleLayout from '../../../../../../../../layout/cms/ConsoleLayout';
import ConsolePromoLayout from '../../../../../../../../layout/console/ConsolePromoLayout';
import { getCmsCompanyLinks } from '../../../../../../../../lib/linkUtils';
import { getPromoSsr } from '../../../../../../../../lib/promoUtils';
import {
  castDbData,
  getAppInitialData,
  GetAppInitialDataPropsInterface,
} from '../../../../../../../../lib/ssrUtils';

interface PromoCodeListPageInterface
  extends GetAppInitialDataPropsInterface,
    ConsolePromoCodeListInterface {}

const PromoCodeListPage: React.FC<PromoCodeListPageInterface> = ({
  layoutProps,
  promo,
  pageCompany,
  promoCodes,
}) => {
  const links = getCmsCompanyLinks({
    companyId: pageCompany._id,
    promoId: promo._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Промо-коды`,
    config: [
      {
        name: 'Компании',
        href: links.parentLink,
      },
      {
        name: pageCompany.name,
        href: links.root,
      },
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
      <ConsolePromoLayout promo={promo} breadcrumbs={breadcrumbs}>
        <ConsolePromoCodeList pageCompany={pageCompany} promo={promo} promoCodes={promoCodes} />
      </ConsolePromoLayout>
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PromoCodeListPageInterface>> => {
  const { db } = await getDatabase();
  const { query } = context;
  const { props } = await getAppInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const companiesCollection = db.collection<CompanyInterface>(COL_COMPANIES);
  const pageCompany = await companiesCollection.findOne({
    _id: new ObjectId(`${query.companyId}`),
  });
  if (!pageCompany) {
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
      pageCompany: castDbData(pageCompany),
      promo: castDbData(promo),
      promoCodes: castDbData(promoCodes),
    },
  };
};

export default PromoCodeListPage;
