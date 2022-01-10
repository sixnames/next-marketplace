import { getCmsCompanyRubricProductsPageSsr } from '../../../../../../../db/dao/ssr/getCmsCompanyRubricProductsPageSsr';
import CmsCompanyRubricProductsPage from './[...filters]';

export const getServerSideProps = getCmsCompanyRubricProductsPageSsr;
export default CmsCompanyRubricProductsPage;
