import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { getConsoleCompanyLinks } from '../../../lib/linkUtils';
import { castDbData, getConsoleInitialData } from '../../../lib/ssrUtils';
import { ConsoleShopAddProductsListPageInterface } from '../../../pages/console/[companyId]/shops/shop/[shopId]/rubrics/[rubricSlug]/add/[...filters]';
import { getAddShopProductSsrData } from '../product/getAddShopProductSsrData';

export const getConsoleShopAddProductsListPageSsr = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ConsoleShopAddProductsListPageInterface>> => {
  const { query } = context;
  const initialProps = await getConsoleInitialData({ context });
  if (!initialProps.props) {
    return {
      notFound: true,
    };
  }
  const locale = initialProps.props.sessionLocale;
  const currency = initialProps.props.initialData.currency;

  const links = getConsoleCompanyLinks({
    companyId: `${query.companyId}`,
    shopId: `${query.shopId}`,
    rubricSlug: `${query.rubricSlug}`,
  });
  const basePath = links.shop.rubrics.root;
  const payload = await getAddShopProductSsrData({
    locale,
    basePath,
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
