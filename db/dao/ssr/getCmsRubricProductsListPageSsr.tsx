import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { DEFAULT_COMPANY_SLUG } from '../../../config/common';
import { alwaysString } from '../../../lib/arrayUtils';
import { getConsoleRubricLinks } from '../../../lib/linkUtils';
import { castDbData, getAppInitialData } from '../../../lib/ssrUtils';
import { CmsRubricProductsListPageInterface } from '../../../pages/cms/rubrics/[rubricSlug]/products/[...filters]';
import { getConsoleRubricProducts } from '../product/getConsoleRubricProducts';

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

  const { products } = getConsoleRubricLinks({
    rubricSlug,
  });
  const itemPath = `${products}/product`;

  const payload = await getConsoleRubricProducts({
    query,
    locale,
    basePath: products,
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
