import { getDbCollections } from 'db/mongodb';
import { getConsoleShopProducts } from 'db/ssr/shops/getConsoleShopProducts';
import { getBasePath } from 'lib/links/linkUtils';

import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { CmsCompanyShopProductsListPageInterface } from 'pages/cms/companies/[companyId]/shops/shop/[shopId]/rubrics/[rubricSlug]/products/[...filters]';

export const getCmsCompanyShopProductsListPageSsr = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CmsCompanyShopProductsListPageInterface>> => {
  const collections = await getDbCollections();
  const companiesCollection = collections.companiesCollection();
  const { query } = context;
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

  const basePath = getBasePath({
    breakpoint: 'products',
    asPath: context.resolvedUrl,
    query: context.query,
  });
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
