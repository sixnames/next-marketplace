import { getCmsCompanyRubricProductsPageSsr } from 'db/ssr/company/getCmsCompanyRubricProductsPageSsr';
import CmsCompanyRubricProductsPage from './[...filters]';

export const getServerSideProps = getCmsCompanyRubricProductsPageSsr;
export default CmsCompanyRubricProductsPage;
