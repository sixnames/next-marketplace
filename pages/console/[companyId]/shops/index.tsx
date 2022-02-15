import { getConsoleShopsListPageSsr } from 'db/ssr/shops/getConsoleShopsListPageSsr';
import ConsoleShopsListPage from './[...filters]';

export const getServerSideProps = getConsoleShopsListPageSsr;
export default ConsoleShopsListPage;
