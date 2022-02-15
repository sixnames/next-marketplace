import { getConsoleShopAddProductsListPageSsr } from 'db/ssr/shops/getConsoleShopAddProductsListPageSsr';
import ConsoleShopAddProductsListPage from './[...filters]';

export const getServerSideProps = getConsoleShopAddProductsListPageSsr;
export default ConsoleShopAddProductsListPage;
