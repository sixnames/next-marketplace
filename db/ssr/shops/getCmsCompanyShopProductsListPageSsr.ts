import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { getCmsCompanyLinks } from 'lib/linkUtils';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { CmsCompanyShopProductsListPageInterface } from 'pages/cms/companies/[companyId]/shops/shop/[shopId]/rubrics/[rubricSlug]/products/[...filters]';
import { COL_COMPANIES } from 'db/collectionNames';
import { CompanyModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { getConsoleShopProducts } from 'db/ssr/shops/getConsoleShopProducts';

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
  const basePath = links.shop.rubrics.product.parentLink;
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
