import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';
import PromoDetails, {
  PromoDetailsInterface,
} from '../../../../../../../components/Promo/PromoDetails';
import { COL_COMPANIES } from '../../../../../../../db/collectionNames';
import { getDatabase } from '../../../../../../../db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  CompanyInterface,
} from '../../../../../../../db/uiInterfaces';
import ConsoleLayout from '../../../../../../../layout/cms/ConsoleLayout';
import ConsolePromoLayout from '../../../../../../../layout/console/ConsolePromoLayout';
import { getCmsCompanyLinks } from '../../../../../../../lib/linkUtils';
import { getPromoSsr } from '../../../../../../../lib/promoUtils';
import {
  castDbData,
  getAppInitialData,
  GetAppInitialDataPropsInterface,
} from '../../../../../../../lib/ssrUtils';

interface PromoDetailsPageInterface
  extends GetAppInitialDataPropsInterface,
    PromoDetailsInterface {}

const PromoDetailsPage: React.FC<PromoDetailsPageInterface> = ({
  layoutProps,
  promo,
  pageCompany,
  basePath,
}) => {
  const { root, parentLink, ...links } = getCmsCompanyLinks({
    companyId: pageCompany._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${promo.name}`,
    config: [
      {
        name: 'Компании',
        href: parentLink,
      },
      {
        name: pageCompany.name,
        href: root,
      },
      {
        name: 'Акции',
        href: links.promo.parentLink,
      },
    ],
  };

  return (
    <ConsoleLayout title={`${promo.name}`} {...layoutProps}>
      <ConsolePromoLayout basePath={basePath} promo={promo} breadcrumbs={breadcrumbs}>
        <PromoDetails basePath={basePath} pageCompany={pageCompany} promo={promo} />
      </ConsolePromoLayout>
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PromoDetailsPageInterface>> => {
  const { query } = context;
  const { props } = await getAppInitialData({ context });
  if (!props || !query.companyId || !query.promoId) {
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

  const links = getCmsCompanyLinks({
    companyId: company._id,
    promoId: promo._id,
  });

  return {
    props: {
      ...props,
      basePath: links.promo.parentLink,
      pageCompany: castDbData(company),
      promo: castDbData(promo),
    },
  };
};

export default PromoDetailsPage;
