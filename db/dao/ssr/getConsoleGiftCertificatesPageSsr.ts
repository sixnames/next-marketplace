import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { alwaysArray } from '../../../lib/arrayUtils';
import { getConsoleCompanyLinks } from '../../../lib/linkUtils';
import { castDbData, getConsoleInitialData } from '../../../lib/ssrUtils';
import { ConsoleGiftCertificatesPageInterface } from '../../../pages/console/[companyId]/gift-certificates/[...filters]';
import { getConsoleGiftCertificates } from '../giftCertificate/getConsoleGiftCertificates';

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
