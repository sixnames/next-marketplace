import { getConsoleRubricProductsListPageSsr } from '../../../../../../db/dao/ssr/getConsoleRubricProductsListPageSsr';
import ConsoleRubricProductsListPage from './[...filters]';

export const getServerSideProps = getConsoleRubricProductsListPageSsr;
export default ConsoleRubricProductsListPage;
