import { ObjectId } from 'mongodb';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import Inner from '../../../../../components/Inner';
import PromoList, { PromoListInterface } from '../../../../../components/Promo/PromoList';
import { COL_COMPANIES } from '../../../../../db/collectionNames';
import { getDatabase } from '../../../../../db/mongodb';
import { AppContentWrapperBreadCrumbs, CompanyInterface } from '../../../../../db/uiInterfaces';
import CmsCompanyLayout from '../../../../../layout/cms/CmsCompanyLayout';
import { getCmsCompanyLinks } from '../../../../../lib/linkUtils';
import { getPromoListSsr } from '../../../../../lib/promoUtils';
import {
  castDbData,
  getAppInitialData,
  GetAppInitialDataPropsInterface,
} from '../../../../../lib/ssrUtils';
import ConsoleLayout from '../../../../../layout/cms/ConsoleLayout';

const pageTitle = 'Акции';

interface PromoListPageInterface extends GetAppInitialDataPropsInterface, PromoListInterface {}

const PromoListPage: NextPage<PromoListPageInterface> = ({
  layoutProps,
  promoList,
  pageCompany,
  basePath,
}) => {
  const { root, parentLink } = getCmsCompanyLinks({
    companyId: pageCompany._id,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: pageTitle,
    config: [
      {
        name: 'Компании',
        href: parentLink,
      },
      {
        name: pageCompany.name,
        href: root,
      },
    ],
  };

  return (
    <ConsoleLayout title={pageTitle} {...layoutProps}>
      <CmsCompanyLayout company={pageCompany} breadcrumbs={breadcrumbs}>
        <Inner>
          <PromoList promoList={promoList} pageCompany={pageCompany} basePath={basePath} />
        </Inner>
      </CmsCompanyLayout>
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PromoListPageInterface>> => {
  const { query } = context;
  const { props } = await getAppInitialData({ context });
  if (!props || !query.companyId) {
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

  const promoList = await getPromoListSsr({
    locale: props.sessionLocale,
    companyId: company._id.toHexString(),
  });

  const links = getCmsCompanyLinks({
    companyId: company._id,
  });

  return {
    props: {
      ...props,
      basePath: links.promo.parentLink,
      pageCompany: castDbData(company),
      promoList: castDbData(promoList),
    },
  };
};

export default PromoListPage;
