import { getConsoleGiftCertificatesPageSsr } from 'db/ssr/company/getConsoleGiftCertificatesPageSsr';
import ConsoleGiftCertificatesPage from './[...filters]';

export const getServerSideProps = getConsoleGiftCertificatesPageSsr;
export default ConsoleGiftCertificatesPage;
