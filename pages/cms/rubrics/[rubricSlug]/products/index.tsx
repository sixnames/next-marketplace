import { getCmsRubricProductsListPageSsr } from '../../../../../db/dao/ssr/getCmsRubricProductsListPageSsr';
import CmsRubricProductsListPage from './[...filters]';

export const getServerSideProps = getCmsRubricProductsListPageSsr;
export default CmsRubricProductsListPage;
