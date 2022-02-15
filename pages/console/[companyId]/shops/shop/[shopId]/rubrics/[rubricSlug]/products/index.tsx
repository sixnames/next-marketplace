import { getConsoleShopProductsListPageSsr } from 'db/ssr/shops/getConsoleShopProductsListPageSsr';
import ConsoleShopProductsListPage from './[...filters]';

export const getServerSideProps = getConsoleShopProductsListPageSsr;
export default ConsoleShopProductsListPage;
