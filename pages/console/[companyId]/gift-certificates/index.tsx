import { getConsoleGiftCertificatesPageSsr } from '../../../../db/dao/ssr/getConsoleGiftCertificatesPageSsr';
import ConsoleGiftCertificatesPage from './[...filters]';

export const getServerSideProps = getConsoleGiftCertificatesPageSsr;
export default ConsoleGiftCertificatesPage;
