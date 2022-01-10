import { getConsoleShopsListPageSsr } from '../../../../db/dao/ssr/getConsoleShopsListPageSsr';
import ConsoleShopsListPage from './[...flters]';

export const getServerSideProps = getConsoleShopsListPageSsr;
export default ConsoleShopsListPage;
