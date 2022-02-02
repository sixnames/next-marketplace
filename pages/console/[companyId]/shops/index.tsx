import { getConsoleShopsListPageSsr } from '../../../../db/dao/ssr/getConsoleShopsListPageSsr';
import ConsoleShopsListPage from './[...filters]';

export const getServerSideProps = getConsoleShopsListPageSsr;
export default ConsoleShopsListPage;
