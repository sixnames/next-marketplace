import { NextPage } from 'next';
import * as React from 'react';
import ConsoleGiftCertificatesList, {
  ConsoleGiftCertificatesListInterface,
} from '../../../../../components/console/ConsoleGiftCertificatesList';
import Inner from '../../../../../components/Inner';
import { getCmsCompanyGiftCertificatesPageSsr } from '../../../../../db/dao/ssr/getCmsCompanyGiftCertificatesPageSsr';
import { AppContentWrapperBreadCrumbs } from '../../../../../db/uiInterfaces';
import CmsCompanyLayout from '../../../../../layout/cms/CmsCompanyLayout';
import ConsoleLayout from '../../../../../layout/cms/ConsoleLayout';
import { getCmsCompanyLinks } from '../../../../../lib/linkUtils';
import { GetAppInitialDataPropsInterface } from '../../../../../lib/ssrUtils';

interface CompanyGiftCertificatesConsumerInterface extends ConsoleGiftCertificatesListInterface {}

const CompanyGiftCertificatesConsumer: React.FC<CompanyGiftCertificatesConsumerInterface> = ({
  pageCompany,
  ...props
}) => {
  const { root, parentLink } = getCmsCompanyLinks({
    companyId: pageCompany?._id,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Подарочные сертификаты',
    config: [
      {
        name: 'Компании',
        href: parentLink,
      },
      {
        name: `${pageCompany?.name}`,
        href: root,
      },
    ],
  };

  return (
    <CmsCompanyLayout company={pageCompany} breadcrumbs={breadcrumbs}>
      <Inner>
        <ConsoleGiftCertificatesList pageCompany={pageCompany} {...props} />
      </Inner>
    </CmsCompanyLayout>
  );
};

export interface CmsCompanyGiftCertificatesPageInterface
  extends GetAppInitialDataPropsInterface,
    CompanyGiftCertificatesConsumerInterface {}

const CmsCompanyGiftCertificatesPage: NextPage<CmsCompanyGiftCertificatesPageInterface> = ({
  layoutProps,
  ...props
}) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <CompanyGiftCertificatesConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = getCmsCompanyGiftCertificatesPageSsr;
export default CmsCompanyGiftCertificatesPage;
