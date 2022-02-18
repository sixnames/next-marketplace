import { CompanyEventsInterface } from 'components/company/CompanyEvents';
import { getCompanySsr } from 'db/ssr/company/getCompanySsr';
import { getRubricEventsList } from 'db/ssr/events/getRubricEventsList';
import { alwaysString } from 'lib/arrayUtils';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

export const getRubricEventsListSsr = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CompanyEventsInterface>> => {
  const { query } = context;
  const rubricSlug = alwaysString(query.rubricSlug);
  const companyId = alwaysString(query.companyId);
  const { props } = await getAppInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  // get company
  const company = await getCompanySsr({
    companyId: `${query.companyId}`,
  });
  if (!company) {
    return {
      notFound: true,
    };
  }

  const locale = props.sessionLocale;
  const currency = props.initialData.currency;

  const links = getProjectLinks({
    rubricSlug,
    companyId,
  });

  const payload = await getRubricEventsList({
    query,
    locale,
    basePath: links.cms.companies.companyId.events.rubricSlug.events.url,
    currency,
    companySlug: company.slug,
  });

  const castedPayload = castDbData(payload);

  const payloadProps: CompanyEventsInterface = {
    ...props,
    ...castedPayload,
    routeBasePath: links.cms.companies.companyId.url,
    pageCompany: castDbData(company),
  };

  return {
    props: payloadProps,
  };
};
