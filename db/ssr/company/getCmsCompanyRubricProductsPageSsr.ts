import { getDbCollections } from 'db/mongodb';
import { getConsoleCompanyRubricProducts } from 'db/ssr/products/getConsoleCompanyRubricProducts';
import { CompanyInterface } from 'db/uiInterfaces';
import { getCmsCompanyLinks } from 'lib/linkUtils';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { CmsCompanyRubricProductsPageInterface } from 'pages/cms/companies/[companyId]/rubrics/[rubricSlug]/products/[...filters]';

export const getCmsCompanyRubricProductsPageSsr = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CmsCompanyRubricProductsPageInterface>> => {
  const { query } = context;
  const collections = await getDbCollections();
  const companiesCollection = collections.companiesCollection();
  const initialProps = await getAppInitialData({ context });
  if (!initialProps.props) {
    return {
      notFound: true,
    };
  }

  // get company
  const companyId = new ObjectId(`${query.companyId}`);
  const companyAggregationResult = await companiesCollection
    .aggregate<CompanyInterface>([
      {
        $match: {
          _id: companyId,
        },
      },
    ])
    .toArray();
  const companyResult = companyAggregationResult[0];
  if (!companyResult) {
    return {
      notFound: true,
    };
  }
  const companySlug = companyResult.slug;

  const locale = initialProps.props.sessionLocale;
  const currency = initialProps.props.initialData.currency;
  const links = getCmsCompanyLinks({
    companyId: companyResult._id,
    rubricSlug: `${query.rubricSlug}`,
  });
  const basePath = links.rubrics.product.parentLink;
  const itemPath = links.rubrics.product.itemPath;

  const payload = await getConsoleCompanyRubricProducts({
    query,
    locale,
    basePath,
    currency,
    companySlug,
    companyId: companyResult._id.toHexString(),
  });

  const castedPayload = castDbData(payload);

  return {
    props: {
      ...initialProps.props,
      ...castedPayload,
      itemPath,
      companySlug,
      pageCompany: castDbData(companyResult),
      routeBasePath: links.root,
    },
  };
};
