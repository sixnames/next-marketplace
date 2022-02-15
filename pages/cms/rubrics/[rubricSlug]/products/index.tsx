import { getCmsRubricProductsListPageSsr } from 'db/ssr/products/getCmsRubricProductsListPageSsr';
import CmsRubricProductsListPage from './[...filters]';

export const getServerSideProps = getCmsRubricProductsListPageSsr;
export default CmsRubricProductsListPage;
