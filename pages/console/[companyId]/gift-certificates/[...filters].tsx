import { NextPage } from 'next';
import * as React from 'react';
import ConsoleGiftCertificatesList, {
  ConsoleGiftCertificatesListInterface,
} from '../../../../components/console/ConsoleGiftCertificatesList';
import Inner from '../../../../components/Inner';
import WpTitle from '../../../../components/WpTitle';
import { getConsoleGiftCertificatesPageSsr } from '../../../../db/dao/ssr/getConsoleGiftCertificatesPageSsr';
import AppContentWrapper from '../../../../layout/AppContentWrapper';
import ConsoleLayout from '../../../../layout/cms/ConsoleLayout';
import { GetAppInitialDataPropsInterface } from '../../../../lib/ssrUtils';

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
