import { getConsoleRubricProducts } from 'db/ssr/rubrics/getConsoleRubricProducts';
import { alwaysString } from 'lib/arrayUtils';
import { DEFAULT_COMPANY_SLUG } from 'lib/config/common';

import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { CmsRubricProductsListPageInterface } from 'pages/cms/rubrics/[rubricSlug]/products/[...filters]';

export const getCmsRubricProductsListPageSsr = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CmsRubricProductsListPageInterface>> => {
  const { query } = context;
  const rubricSlug = alwaysString(query.rubricSlug);
  const initialProps = await getAppInitialData({ context });

  // Get shop
  if (!initialProps.props) {
    return {
      notFound: true,
    };
  }
  const locale = initialProps.props.sessionLocale;
  const currency = initialProps.props.initialData.currency;

  const links = getProjectLinks({
    rubricSlug,
  });
  const itemPath = links.product.itemPath;

  const payload = await getConsoleRubricProducts({
    query,
    locale,
    basePath: links.product.parentLink,
    currency,
    companySlug: DEFAULT_COMPANY_SLUG,
  });

  const castedPayload = castDbData(payload);

  return {
    props: {
      ...initialProps.props,
      ...castedPayload,
      itemPath,
      companySlug: DEFAULT_COMPANY_SLUG,
    },
  };
};
