import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { DEFAULT_CURRENCY, DEFAULT_PAGE_FILTER } from '../../../config/common';
import { alwaysArray, alwaysString } from '../../../lib/arrayUtils';
import { getCmsCompanyLinks } from '../../../lib/linkUtils';
import { getPromoSsr } from '../../../lib/promoUtils';
import { castDbData, getAppInitialData } from '../../../lib/ssrUtils';
import { CmsPromoProductsListPageInterface } from '../../../pages/cms/companies/[companyId]/promo/details/[promoId]/rubrics/[rubricSlug]/products/[...filters]';
import { COL_COMPANIES, COL_RUBRICS } from '../../collectionNames';
import { RubricModel } from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { CompanyInterface } from '../../uiInterfaces';
import { getConsolePromoProducts } from '../promo/getConsolePromoProducts';
import { castRubricForUI } from '../rubrics/castRubricForUI';

export const getCmsPromoProductsListPageSsr = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CmsPromoProductsListPageInterface>> => {
  const { query } = context;
  const { props } = await getAppInitialData({ context });
  if (!props) {
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
    slug: new ObjectId(`${query.rubricSlug}`),
  });
  if (!initialRubric) {
    return {
      notFound: true,
    };
  }
  const rubric = castRubricForUI({ rubric: initialRubric, locale: props.sessionLocale });

  const links = getCmsCompanyLinks({
    companyId: company._id,
    promoId: promo._id,
  });
  const basePath = links.promo.root;
  const promoProducts = await getConsolePromoProducts({
    search: alwaysString(query.search),
    filters: alwaysArray(query.filters),
    rubricSlug: initialRubric.slug,
    promoId: promo._id,
    locale,
    currency: props.currentCity?.currency || DEFAULT_CURRENCY,
    companyId: company._id,
    basePath: `${basePath}/rubrics/${rubric._id}/products/${DEFAULT_PAGE_FILTER}`,
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
      filters: alwaysArray(query.filters).filter((filter) => filter !== DEFAULT_PAGE_FILTER),
      search: alwaysString(query.search),
    },
  };
};
