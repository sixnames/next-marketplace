import { getConsolePromoProductsListPageSsr } from 'db/ssr/company/getConsolePromoProductsListPageSsr';
import ConsolePromoProductsListPage from './[...filters]';

export const getServerSideProps = getConsolePromoProductsListPageSsr;
export default ConsolePromoProductsListPage;
