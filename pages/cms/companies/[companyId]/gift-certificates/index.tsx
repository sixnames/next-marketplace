import { getCmsCompanyGiftCertificatesPageSsr } from 'db/ssr/company/getCmsCompanyGiftCertificatesPageSsr';
import CmsCompanyGiftCertificatesPage from './[...filters]';

export default CmsCompanyGiftCertificatesPage;
export const getServerSideProps = getCmsCompanyGiftCertificatesPageSsr;
