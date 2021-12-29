import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { getConsoleCompanyLinks } from '../../../lib/linkUtils';
import { castDbData, getConsoleInitialData } from '../../../lib/ssrUtils';
import { ConsoleRubricProductsListPageInterface } from '../../../pages/console/[companyId]/rubrics/[rubricSlug]/products/[...filters]';
import { getConsoleCompanyRubricProducts } from '../product/getConsoleCompanyRubricProducts';

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
  const links = getConsoleCompanyLinks({
    companyId: props.layoutProps.pageCompany._id,
    rubricSlug: `${query.rubricSlug}`,
  });
  const basePath = links.rubrics.products;
  const itemPath = links.rubrics.product.parentLink;

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
      itemPath,
      companySlug,
      routeBasePath: links.parentLink,
    },
  };
};
