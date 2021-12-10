import ConsolePromoProducts, {
  ConsolePromoProductsInterface,
} from 'components/console/ConsolePromoProducts';
import { DEFAULT_CURRENCY, ROUTE_CMS } from 'config/common';
import { COL_COMPANIES, COL_RUBRICS } from 'db/collectionNames';
import { getConsolePromoProducts } from 'db/dao/promo/getConsolePromoProducts';
import { castRubricForUI } from 'db/dao/rubrics/castRubricForUI';
import { RubricModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { AppContentWrapperBreadCrumbs, CompanyInterface } from 'db/uiInterfaces';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import ConsolePromoLayout from 'layout/console/ConsolePromoLayout';
import { alwaysArray, alwaysString } from 'lib/arrayUtils';
import { getPromoSsr } from 'lib/promoUtils';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';

interface PromoProductsPageInterface
  extends GetAppInitialDataPropsInterface,
    ConsolePromoProductsInterface {}

const PromoProductsPage: React.FC<PromoProductsPageInterface> = ({
  layoutProps,
  promo,
  pageCompany,
  basePath,
  promoProducts,
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
          rubric={rubric}
          promo={promo}
          pageCompany={pageCompany}
          promoProducts={promoProducts}
        />
      </ConsolePromoLayout>
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PromoProductsPageInterface>> => {
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
  const locale = props.sessionLocale;
  const promo = await getPromoSsr({
    locale,
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

  const basePath = `${ROUTE_CMS}/companies/${company._id}/promo/details/${promo._id}`;
  const promoProducts = await getConsolePromoProducts({
    search: alwaysString(query.search),
    filters: alwaysArray(query.filters),
    rubricSlug: initialRubric.slug,
    promoId: promo._id,
    locale,
    currency: props.currentCity?.currency || DEFAULT_CURRENCY,
    companyId: company._id,
    basePath: `${basePath}/rubrics/${rubric._id}/products/${rubric._id}`,
    excludedShopProductIds: [],
  });

  return {
    props: {
      ...props,
      basePath,
      pageCompany: castDbData(company),
      promo: castDbData(promo),
      rubric: castDbData(rubric),
      promoProducts: castDbData(promoProducts),
    },
  };
};

export default PromoProductsPage;
