import { getCmsCompanyGiftCertificatesPageSsr } from '../../../../../db/dao/ssr/getCmsCompanyGiftCertificatesPageSsr';
import CmsCompanyGiftCertificatesPage from './[...filters]';

export default CmsCompanyGiftCertificatesPage;
export const getServerSideProps = getCmsCompanyGiftCertificatesPageSsr;
