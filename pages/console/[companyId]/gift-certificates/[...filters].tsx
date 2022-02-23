import ConsoleGiftCertificatesList, {
  ConsoleGiftCertificatesListInterface,
} from 'components/console/ConsoleGiftCertificatesList';
import Inner from 'components/Inner';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import WpTitle from 'components/WpTitle';
import { getConsoleGiftCertificatesPageSsr } from 'db/ssr/company/getConsoleGiftCertificatesPageSsr';
import { GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { NextPage } from 'next';
import * as React from 'react';

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

export interface ConsoleGiftCertificatesPageInterface
  extends GetAppInitialDataPropsInterface,
    CompanyGiftCertificatesConsumerInterface {}

const ConsoleGiftCertificatesPage: NextPage<ConsoleGiftCertificatesPageInterface> = ({
  layoutProps,
  ...props
}) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <CompanyGiftCertificatesConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = getConsoleGiftCertificatesPageSsr;
export default ConsoleGiftCertificatesPage;
