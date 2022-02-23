import { getAddShopProductSsrData } from 'db/ssr/shops/getAddShopProductSsrData';
import { alwaysString } from 'lib/arrayUtils';
import { DEFAULT_COMPANY_SLUG } from 'lib/config/common';

import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { CompanyShopAddProductsListPageInterface } from 'pages/cms/companies/[companyId]/shops/shop/[shopId]/rubrics/[rubricSlug]/add/[...filters]';

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

  const { shop } = getCmsCompanyLinks({
    companyId: `${query.companyId}`,
    shopId: shopId,
    rubricSlug: `${query.rubricSlug}`,
  });
  const locale = initialProps.props.sessionLocale;
  const currency = initialProps.props.initialData.currency;
  const basePath = shop.rubrics.add;

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
