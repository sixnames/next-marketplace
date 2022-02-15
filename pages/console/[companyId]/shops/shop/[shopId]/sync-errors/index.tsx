import { getConsoleShopSyncErrorsListPageSsr } from 'db/ssr/shops/getConsoleShopSyncErrorsListPageSsr';
import ConsoleShopSyncErrorsListPage from './[...filters]';

export const getServerSideProps = getConsoleShopSyncErrorsListPageSsr;
export default ConsoleShopSyncErrorsListPage;
