import ConsolePromoCodeDetails, {
  ConsolePromoCodeDetailsInterface,
} from 'components/console/ConsolePromoCodeDetails';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import ConsolePromoLayout from 'components/layout/console/ConsolePromoLayout';
import { getDbCollections } from 'db/mongodb';
import { AppContentWrapperBreadCrumbs, CompanyInterface, PromoInterface } from 'db/uiInterfaces';
import { getProjectLinks } from 'lib/links/getProjectLinks';

import { getPromoSsr } from 'lib/promoUtils';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';

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
  const links = getProjectLinks({
    companyId: pageCompany._id,
    promoId: promo._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: promoCode.code,
    config: [
      {
        name: 'Компании',
        href: links.cms.companies.url,
      },
      {
        name: pageCompany.name,
        href: links.cms.companies.companyId.url,
      },
      {
        name: 'Акции',
        href: links.cms.companies.companyId.promo.url,
      },
      {
        name: `${promo.name}`,
        href: links.cms.companies.companyId.promo.details.promoId.url,
      },
      {
        name: `Промо-коды`,
        href: links.cms.companies.companyId.promo.details.promoId.code.url,
      },
    ],
  };

  return (
    <ConsoleLayout title={`${promo.name}`} {...layoutProps}>
      <ConsolePromoLayout promo={promo} breadcrumbs={breadcrumbs}>
        <ConsolePromoCodeDetails promoCode={promoCode} />
      </ConsolePromoLayout>
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
