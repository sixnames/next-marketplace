import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { getConsoleCompanyLinks } from '../../../lib/linkUtils';
import { castDbData, getConsoleInitialData } from '../../../lib/ssrUtils';
import { ConsoleShopProductsListPageInterface } from '../../../pages/console/[companyId]/shops/shop/[shopId]/rubrics/[rubricSlug]/products/[...filters]';
import { getConsoleShopProducts } from '../product/getConsoleShopProducts';

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

  const links = getConsoleCompanyLinks({
    companyId: `${query.companyId}`,
    shopId: `${query.shopId}`,
    rubricSlug: `${query.rubricSlug}`,
  });
  const basePath = links.shop.rubrics.root;
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
