import { getConsoleGiftCertificates } from 'db/ssr/company/getConsoleGiftCertificates';
import { alwaysArray } from 'lib/arrayUtils';

import { castDbData, getConsoleInitialData } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { ConsoleGiftCertificatesPageInterface } from 'pages/console/[companyId]/gift-certificates/[...filters]';

export const getConsoleGiftCertificatesPageSsr = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ConsoleGiftCertificatesPageInterface>> => {
  const { query } = context;
  const { props } = await getConsoleInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const { filters } = query;
  const company = props.layoutProps.pageCompany;
  const rawPayload = await getConsoleGiftCertificates({
    filters: alwaysArray(filters),
    companyId: new ObjectId(company._id),
    locale: props.sessionLocale,
  });
  const payload = castDbData(rawPayload);

  const links = getConsoleCompanyLinks({
    companyId: company._id,
  });

  return {
    props: {
      ...props,
      ...payload,
      pageCompany: castDbData(company),
      userRouteBasePath: links.user.itemPath,
    },
  };
};
