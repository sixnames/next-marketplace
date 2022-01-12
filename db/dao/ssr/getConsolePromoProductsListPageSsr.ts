import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { DEFAULT_CURRENCY, DEFAULT_PAGE_FILTER } from '../../../config/common';
import { alwaysArray, alwaysString } from '../../../lib/arrayUtils';
import { getConsoleCompanyLinks } from '../../../lib/linkUtils';
import { getPromoSsr } from '../../../lib/promoUtils';
import { castDbData, getConsoleInitialData } from '../../../lib/ssrUtils';
import { ConsolePromoProductsListPageInterface } from '../../../pages/console/[companyId]/promo/details/[promoId]/rubrics/[rubricSlug]/products/[...filters]';
import { COL_RUBRICS } from '../../collectionNames';
import { RubricModel } from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { getConsolePromoProducts } from '../promo/getConsolePromoProducts';
import { castRubricForUI } from '../rubrics/castRubricForUI';

export const getConsolePromoProductsListPageSsr = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ConsolePromoProductsListPageInterface>> => {
  const { query } = context;
  const { props } = await getConsoleInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const { db } = await getDatabase();
  const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);

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

  const links = getConsoleCompanyLinks({
    companyId: props.layoutProps.pageCompany._id,
    promoId: promo._id,
    rubricSlug: `${query.rubricSlug}`,
  });

  const promoProducts = await getConsolePromoProducts({
    search: alwaysString(query.search),
    filters: alwaysArray(query.filters),
    rubricSlug: initialRubric.slug,
    promoId: promo._id,
    locale,
    currency: props.currentCity?.currency || DEFAULT_CURRENCY,
    companyId: props.layoutProps.pageCompany._id,
    basePath: links.promo.rubrics.product.parentLink,
    excludedShopProductIds: [],
  });

  return {
    props: {
      ...props,
      basePath: links.promo.root,
      pageCompany: castDbData(props.layoutProps.pageCompany),
      promo: castDbData(promo),
      rubric: castDbData(rubric),
      promoProducts: castDbData(promoProducts),
      filters: alwaysArray(query.filters).filter((filter) => filter !== DEFAULT_PAGE_FILTER),
      search: alwaysString(query.search),
    },
  };
};
