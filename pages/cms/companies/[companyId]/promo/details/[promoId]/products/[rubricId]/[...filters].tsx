import { ROUTE_CMS } from 'config/common';
import { COL_COMPANIES, COL_RUBRICS } from 'db/collectionNames';
import { castRubricForUI } from 'db/dao/rubrics/castRubricForUI';
import { RubricModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  CompanyInterface,
  PromoInterface,
  RubricInterface,
  ShopProductInterface,
} from 'db/uiInterfaces';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import ConsolePromoLayout from 'layout/console/ConsolePromoLayout';
import { getPromoSsr } from 'lib/promoUtils';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';

export interface ConsolePromoProductsInterface {
  rubric: RubricInterface;
  promo: PromoInterface;
  basePath: string;
  pageCompany: CompanyInterface;
  shopProducts: ShopProductInterface[];
}

const ConsolePromoProducts: React.FC<ConsolePromoProductsInterface> = () => {
  return <div />;
};

interface PromoDetailsPageInterface
  extends GetAppInitialDataPropsInterface,
    ConsolePromoProductsInterface {}

const PromoDetailsPage: React.FC<PromoDetailsPageInterface> = ({
  layoutProps,
  promo,
  pageCompany,
  basePath,
  shopProducts,
  rubric,
}) => {
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${rubric.name}`,
    config: [
      {
        name: 'Компании',
        href: `${ROUTE_CMS}/companies`,
      },
      {
        name: pageCompany.name,
        href: `${ROUTE_CMS}/companies/${pageCompany._id}`,
      },
      {
        name: 'Акции',
        href: `${ROUTE_CMS}/companies/${pageCompany._id}/promo`,
      },
      {
        name: `${promo.name}`,
        href: `${ROUTE_CMS}/companies/${pageCompany._id}/promo/details/${promo._id}`,
      },
      {
        name: `Товары`,
        href: `${ROUTE_CMS}/companies/${pageCompany._id}/promo/details/${promo._id}/products`,
      },
    ],
  };

  return (
    <ConsoleLayout title={`${promo.name}`} {...layoutProps}>
      <ConsolePromoLayout basePath={basePath} promo={promo} breadcrumbs={breadcrumbs}>
        <ConsolePromoProducts
          basePath={basePath}
          pageCompany={pageCompany}
          shopProducts={shopProducts}
          promo={promo}
          rubric={rubric}
        />
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
  const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);

  // get company
  const company = await companiesCollection.findOne({
    _id: new ObjectId(`${query.companyId}`),
  });
  if (!company) {
    return {
      notFound: true,
    };
  }

  // get promo
  const promo = await getPromoSsr({
    locale: props.sessionLocale,
    promoId: `${query.promoId}`,
  });
  if (!promo) {
    return {
      notFound: true,
    };
  }

  // get rubric
  const initialRubric = await rubricsCollection.findOne({
    _id: new ObjectId(`${query.rubricId}`),
  });
  if (!initialRubric) {
    return {
      notFound: true,
    };
  }
  const rubric = castRubricForUI({ rubric: initialRubric, locale: props.sessionLocale });

  return {
    props: {
      ...props,
      basePath: `${ROUTE_CMS}/companies/${company._id}/promo/details/${promo._id}`,
      pageCompany: castDbData(company),
      promo: castDbData(promo),
      rubric: castDbData(rubric),
      shopProducts: [],
    },
  };
};

export default PromoDetailsPage;
