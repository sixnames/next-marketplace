import ConsoleGiftCertificatesList, {
  ConsoleGiftCertificatesListInterface,
} from 'components/console/ConsoleGiftCertificatesList';
import Inner from 'components/Inner';
import Title from 'components/Title';
import { ROUTE_CONSOLE } from 'config/common';
import { getConsoleGiftCertificates } from 'db/dao/giftCertificate/getConsoleGiftCertificates';
import AppContentWrapper from 'layout/AppContentWrapper';
import { ObjectId } from 'mongodb';
import * as React from 'react';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, GetAppInitialDataPropsInterface, getConsoleInitialData } from 'lib/ssrUtils';

interface CompanyGiftCertificatesConsumerInterface extends ConsoleGiftCertificatesListInterface {}

const CompanyGiftCertificatesConsumer: React.FC<CompanyGiftCertificatesConsumerInterface> = (
  props,
) => {
  return (
    <AppContentWrapper>
      <Inner lowTop>
        <Title>Подарочные сертификаты</Title>
        <ConsoleGiftCertificatesList {...props} />
      </Inner>
    </AppContentWrapper>
  );
};

interface CompanyGiftCertificatesPageInterface
  extends GetAppInitialDataPropsInterface,
    CompanyGiftCertificatesConsumerInterface {}

const CompanyGiftCertificatesPage: NextPage<CompanyGiftCertificatesPageInterface> = ({
  layoutProps,
  ...props
}) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <CompanyGiftCertificatesConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CompanyGiftCertificatesPageInterface>> => {
  const { props } = await getConsoleInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const company = props.layoutProps.pageCompany;
  const rawPayload = await getConsoleGiftCertificates({
    filters: [],
    companyId: new ObjectId(company._id),
    locale: props.sessionLocale,
  });
  const payload = castDbData(rawPayload);

  return {
    props: {
      ...props,
      ...payload,
      pageCompany: castDbData(company),
      userRouteBasePath: `${ROUTE_CONSOLE}/${company._id}/customers/user`,
    },
  };
};

export default CompanyGiftCertificatesPage;
