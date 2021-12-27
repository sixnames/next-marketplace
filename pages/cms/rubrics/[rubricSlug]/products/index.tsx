import { getCmsRubricProductsListPageProps } from '../../../../../db/dao/ssr/getCmsRubricProductsListPageProps';
import CmsRubricProductsListPage from './[...filters]';

export const getServerSideProps = getCmsRubricProductsListPageProps;
export default CmsRubricProductsListPage;
