import { getConsoleCustomersPageSsr } from '../../../../db/dao/ssr/getConsoleCustomersPageSsr';
import ConsoleCustomersPage from './[...filters]';

export const getServerSideProps = getConsoleCustomersPageSsr;
export default ConsoleCustomersPage;
