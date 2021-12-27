import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { DEFAULT_COMPANY_SLUG } from '../../../config/common';
import { alwaysString } from '../../../lib/arrayUtils';
import { getConsoleCompanyLinks } from '../../../lib/linkUtils';
import { castDbData, getAppInitialData } from '../../../lib/ssrUtils';
import { CompanyShopAddProductsListPageInterface } from '../../../pages/cms/companies/[companyId]/shops/shop/[shopId]/products/[rubricSlug]/add/[...filters]';
import { getAddShopProductSsrData } from '../product/getAddShopProductSsrData';

export const getCompanyShopAddProductsListPageSsr = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CompanyShopAddProductsListPageInterface>> => {
  const { query } = context;
  const shopId = alwaysString(query.shopId);
  const initialProps = await getAppInitialData({ context });

  if (!initialProps.props) {
    return {
      notFound: true,
    };
  }

  const { shop } = getConsoleCompanyLinks({
    companyId: `${query.companyId}`,
    shopId: shopId,
    rubricSlug: `${query.rubricSlug}`,
  });
  const locale = initialProps.props.sessionLocale;
  const currency = initialProps.props.initialData.currency;
  const basePath = shop.products.rubric.add;

  const payload = await getAddShopProductSsrData({
    locale,
    basePath,
    query,
    currency,
    companySlug: DEFAULT_COMPANY_SLUG,
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
