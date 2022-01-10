import { getConsoleShopSyncErrorsListPageSsr } from '../../../../../../../db/dao/ssr/getConsoleShopSyncErrorsListPageSsr';
import ConsoleShopSyncErrorsListPage from './[...filters]';

export const getServerSideProps = getConsoleShopSyncErrorsListPageSsr;
export default ConsoleShopSyncErrorsListPage;
