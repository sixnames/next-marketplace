import { getConsoleShopProductsListPageSsr } from '../../../../../../../../../db/dao/ssr/getConsoleShopProductsListPageSsr';
import ConsoleShopProductsListPage from './[...filters]';

export const getServerSideProps = getConsoleShopProductsListPageSsr;
export default ConsoleShopProductsListPage;
