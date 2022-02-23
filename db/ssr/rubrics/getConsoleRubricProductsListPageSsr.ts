import { getConsoleCompanyRubricProducts } from 'db/ssr/products/getConsoleCompanyRubricProducts';
import { getProjectLinks } from 'lib/links/getProjectLinks';

import { castDbData, getConsoleInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { ConsoleRubricProductsListPageInterface } from 'pages/console/[companyId]/rubrics/[rubricSlug]/products/[...filters]';

export const getConsoleRubricProductsListPageSsr = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ConsoleRubricProductsListPageInterface>> => {
  const { query } = context;
  const { props } = await getConsoleInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  // get company
  const pageCompany = props.layoutProps.pageCompany;
  const companySlug = pageCompany.slug;

  const locale = props.sessionLocale;
  const currency = props.initialData.currency;
  const links = getProjectLinks({
    companyId: props.layoutProps.pageCompany._id,
    rubricSlug: `${query.rubricSlug}`,
  });
  const basePath = links.console.companyId.rubrics.rubricSlug.products.url;

  const payload = await getConsoleCompanyRubricProducts({
    query: context.query,
    locale,
    basePath,
    currency,
    companySlug,
    companyId: `${pageCompany._id}`,
  });

  const castedPayload = castDbData(payload);

  return {
    props: {
      ...props,
      ...castedPayload,
      companySlug,
    },
  };
};
