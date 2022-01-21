import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';
import ConsolePromoCodeDetails, {
  ConsolePromoCodeDetailsInterface,
} from '../../../../../../../components/console/ConsolePromoCodeDetails';
import { COL_PROMO_CODES } from '../../../../../../../db/collectionNames';
import { PromoCodeModel } from '../../../../../../../db/dbModels';
import { getDatabase } from '../../../../../../../db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  CompanyInterface,
  PromoInterface,
} from '../../../../../../../db/uiInterfaces';
import ConsoleLayout from '../../../../../../../layout/cms/ConsoleLayout';
import ConsolePromoLayout from '../../../../../../../layout/console/ConsolePromoLayout';
import { getConsoleCompanyLinks } from '../../../../../../../lib/linkUtils';
import { getPromoSsr } from '../../../../../../../lib/promoUtils';
import {
  castDbData,
  GetAppInitialDataPropsInterface,
  getConsoleInitialData,
} from '../../../../../../../lib/ssrUtils';

interface PromoDetailsPageInterface
  extends GetAppInitialDataPropsInterface,
    ConsolePromoCodeDetailsInterface {
  promo: PromoInterface;
  pageCompany: CompanyInterface;
}

const PromoDetailsPage: React.FC<PromoDetailsPageInterface> = ({
  layoutProps,
  promo,
  pageCompany,
  promoCode,
}) => {
  const links = getConsoleCompanyLinks({
    companyId: pageCompany._id,
    promoId: promo._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: promoCode.code,
    config: [
      {
        name: 'Акции',
        href: links.promo.parentLink,
      },
      {
        name: `${promo.name}`,
        href: links.promo.root,
      },
      {
        name: `Промо-коды`,
        href: links.promo.code.parentLink,
      },
    ],
  };

  return (
    <ConsoleLayout title={`${promo.name}`} {...layoutProps}>
      <ConsolePromoLayout promo={promo} basePath={links.parentLink} breadcrumbs={breadcrumbs}>
        <ConsolePromoCodeDetails promoCode={promoCode} />
      </ConsolePromoLayout>
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PromoDetailsPageInterface>> => {
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
  const promoCodesAggregation = await promoCodesCollection
    .aggregate([
      {
        $match: {
          _id: new ObjectId(`${query.promoCodeId}`),
        },
      },
    ])
    .toArray();
  const promoCode = promoCodesAggregation[0];
  if (!promoCode) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...props,
      pageCompany: props.layoutProps.pageCompany,
      promo: castDbData(promo),
      promoCode: castDbData(promoCode),
    },
  };
};

export default PromoDetailsPage;
