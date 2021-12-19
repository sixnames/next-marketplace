import { ObjectId } from 'mongodb';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import ConsoleGiftCertificatesList, {
  ConsoleGiftCertificatesListInterface,
} from '../../../../components/console/ConsoleGiftCertificatesList';
import Inner from '../../../../components/Inner';
import WpTitle from '../../../../components/WpTitle';
import { ROUTE_CONSOLE } from '../../../../config/common';
import { getConsoleGiftCertificates } from '../../../../db/dao/giftCertificate/getConsoleGiftCertificates';
import AppContentWrapper from '../../../../layout/AppContentWrapper';
import ConsoleLayout from '../../../../layout/cms/ConsoleLayout';
import { alwaysArray } from '../../../../lib/arrayUtils';
import {
  castDbData,
  GetAppInitialDataPropsInterface,
  getConsoleInitialData,
} from '../../../../lib/ssrUtils';

interface CompanyGiftCertificatesConsumerInterface extends ConsoleGiftCertificatesListInterface {}

const CompanyGiftCertificatesConsumer: React.FC<CompanyGiftCertificatesConsumerInterface> = (
  props,
) => {
  return (
    <AppContentWrapper>
      <Inner lowTop>
        <WpTitle>Подарочные сертификаты</WpTitle>
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
