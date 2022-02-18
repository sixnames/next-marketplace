import { CompanyEventsInterface } from 'components/company/CompanyEvents';
import { getRubricEventsList } from 'db/ssr/events/getRubricEventsList';
import { alwaysString } from 'lib/arrayUtils';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { castDbData, getConsoleInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

export const getConsoleRubricEventsListSsr = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CompanyEventsInterface>> => {
  const { query } = context;
  const rubricSlug = alwaysString(query.rubricSlug);
  const companyId = alwaysString(query.companyId);
  const { props } = await getConsoleInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  // get company
  const company = props.layoutProps.pageCompany;

  const locale = props.sessionLocale;
  const currency = props.initialData.currency;

  const links = getProjectLinks({
    rubricSlug,
    companyId,
  });

  const payload = await getRubricEventsList({
    query,
    locale,
    basePath: links.console.companyId.events.rubricSlug.events.url,
    currency,
    companySlug: company.slug,
  });

  const castedPayload = castDbData(payload);

  const payloadProps: CompanyEventsInterface = {
    ...props,
    ...castedPayload,
    routeBasePath: links.console.companyId.url,
    pageCompany: castDbData(company),
  };

  return {
    props: payloadProps,
  };
};
