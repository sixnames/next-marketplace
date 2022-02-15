import { getConsoleCustomersPageSsr } from 'db/ssr/users/getConsoleCustomersPageSsr';
import ConsoleCustomersPage from './[...filters]';

export const getServerSideProps = getConsoleCustomersPageSsr;
export default ConsoleCustomersPage;
