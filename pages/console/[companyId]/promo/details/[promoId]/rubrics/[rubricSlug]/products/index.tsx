import { getConsolePromoProductsListPageSsr } from '../../../../../../../../../db/dao/ssr/getConsolePromoProductsListPageSsr';
import ConsolePromoProductsListPage from './[...filters]';

export const getServerSideProps = getConsolePromoProductsListPageSsr;
export default ConsolePromoProductsListPage;
