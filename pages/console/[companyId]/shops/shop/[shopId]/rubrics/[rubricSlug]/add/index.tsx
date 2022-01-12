import { getConsoleShopAddProductsListPageSsr } from '../../../../../../../../../db/dao/ssr/getConsoleShopAddProductsListPageSsr';
import ConsoleShopAddProductsListPage from './[...filters]';

export const getServerSideProps = getConsoleShopAddProductsListPageSsr;
export default ConsoleShopAddProductsListPage;
