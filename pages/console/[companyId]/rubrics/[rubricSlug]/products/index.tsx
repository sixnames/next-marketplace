import { getConsoleRubricProductsListPageSsr } from 'db/ssr/rubrics/getConsoleRubricProductsListPageSsr';
import ConsoleRubricProductsListPage from './[...filters]';

export const getServerSideProps = getConsoleRubricProductsListPageSsr;
export default ConsoleRubricProductsListPage;
