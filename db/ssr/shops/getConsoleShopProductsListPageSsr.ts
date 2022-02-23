import { getConsoleShopProducts } from 'db/ssr/shops/getConsoleShopProducts';
import { getProjectLinks } from 'lib/links/getProjectLinks';

import { castDbData, getConsoleInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { ConsoleShopProductsListPageInterface } from 'pages/console/[companyId]/shops/shop/[shopId]/rubrics/[rubricSlug]/products/[...filters]';

export const getConsoleShopProductsListPageSsr = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ConsoleShopProductsListPageInterface>> => {
  const { query } = context;
  const initialProps = await getConsoleInitialData({ context });
  if (!initialProps || !initialProps.props) {
    return {
      notFound: true,
    };
  }

  const links = getProjectLinks({
    companyId: `${query.companyId}`,
    shopId: `${query.shopId}`,
    rubricSlug: `${query.rubricSlug}`,
  });
  const basePath = links.console.companyId.shops.shop.shopId.rubrics.rubricSlug.products.url;
  const locale = initialProps.props.sessionLocale;
  const currency = initialProps.props.initialData.currency;
  const payload = await getConsoleShopProducts({
    basePath,
    locale,
    query,
    currency,
    companySlug: initialProps.props.layoutProps.pageCompany.slug,
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
