import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';
import { COL_COMPANIES, COL_PROMO_CODES } from '../../../../../../../../db/collectionNames';
import { PromoCodeModel } from '../../../../../../../../db/dbModels';
import { getDatabase } from '../../../../../../../../db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  CompanyInterface,
  PromoInterface,
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

interface PromoDetailsPageInterface extends GetAppInitialDataPropsInterface {
  promo: PromoInterface;
  pageCompany: CompanyInterface;
  promoCode: PromoCodeModel;
}

const PromoDetailsPage: React.FC<PromoDetailsPageInterface> = ({
  layoutProps,
  promo,
  pageCompany,
  promoCode,
}) => {
  const links = getCmsCompanyLinks({
    companyId: pageCompany._id,
    promoId: promo._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: promoCode.code,
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
      {
        name: `Промо-коды`,
        href: links.promo.code.parentLink,
      },
    ],
  };

  return (
    <ConsoleLayout title={`${promo.name}`} {...layoutProps}>
      <ConsolePromoLayout promo={promo} breadcrumbs={breadcrumbs}></ConsolePromoLayout>
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PromoDetailsPageInterface>> => {
  const { query } = context;
  const { props } = await getAppInitialData({ context });
  if (!props) {
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
      pageCompany: castDbData(company),
      promo: castDbData(promo),
      promoCode: castDbData(promoCode),
    },
  };
};

export default PromoDetailsPage;
