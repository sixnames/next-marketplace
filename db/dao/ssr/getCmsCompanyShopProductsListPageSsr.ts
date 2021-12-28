import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { getCmsCompanyLinks } from '../../../lib/linkUtils';
import { castDbData, getAppInitialData } from '../../../lib/ssrUtils';
import { CmsCompanyShopProductsListPageInterface } from '../../../pages/cms/companies/[companyId]/shops/shop/[shopId]/products/[rubricSlug]/[...filters]';
import { COL_COMPANIES } from '../../collectionNames';
import { CompanyModel } from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { getConsoleShopProducts } from '../product/getConsoleShopProducts';

export const getCmsCompanyShopProductsListPageSsr = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CmsCompanyShopProductsListPageInterface>> => {
  const { db } = await getDatabase();
  const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);
  const { query } = context;
  const { shopId, rubricSlug } = query;
  const initialProps = await getAppInitialData({ context });
  if (!initialProps || !initialProps.props) {
    return {
      notFound: true,
    };
  }

  const company = await companiesCollection.findOne({
    _id: new ObjectId(`${query.companyId}`),
  });
  if (!company) {
    return {
      notFound: true,
    };
  }

  const links = getCmsCompanyLinks({
    companyId: company._id.toHexString(),
    shopId: `${shopId}`,
    rubricSlug: `${rubricSlug}`,
  });
  const basePath = links.shop.products.rubric.root;
  const locale = initialProps.props.sessionLocale;
  const currency = initialProps.props.initialData.currency;

  const payload = await getConsoleShopProducts({
    basePath,
    locale,
    query,
    currency,
    companySlug: company.slug,
  });
  if (!payload) {
    return {
      notFound: true,
    };
  }

  const castedPayload = castDbData(payload);

  return {
    props: {
      ...initialProps.props,
      ...castedPayload,
    },
  };
};
