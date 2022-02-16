import { castRubricForUI } from 'db/cast/castRubricForUI';
import { getDbCollections } from 'db/mongodb';
import { getConsolePromoProducts } from 'db/ssr/promo/getConsolePromoProducts';
import { alwaysArray, alwaysString } from 'lib/arrayUtils';
import { DEFAULT_CURRENCY } from 'lib/config/common';
import { getCmsCompanyLinks } from 'lib/linkUtils';
import { getPromoSsr } from 'lib/promoUtils';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { CmsPromoProductsListPageInterface } from 'pages/cms/companies/[companyId]/promo/details/[promoId]/rubrics/[rubricSlug]/products/[...filters]';

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

  const collections = await getDbCollections();
  const companiesCollection = collections.companiesCollection();
  const rubricsCollection = collections.rubricsCollection();

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
    slug: `${query.rubricSlug}`,
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
    rubricSlug: rubric.slug,
  });
  const promoProducts = await getConsolePromoProducts({
    search: alwaysString(query.search),
    filters: alwaysArray(query.filters),
    rubricSlug: initialRubric.slug,
    promoId: promo._id,
    locale,
    currency: props.currentCity?.currency || DEFAULT_CURRENCY,
    companyId: company._id,
    basePath: links.promo.rubrics.product.parentLink,
    excludedShopProductIds: [],
  });

  return {
    props: {
      ...props,
      pageCompany: castDbData(company),
      promo: castDbData(promo),
      rubric: castDbData(rubric),
      promoProducts: castDbData(promoProducts),
      filters: alwaysArray(query.filters),
      search: alwaysString(query.search),
    },
  };
};
