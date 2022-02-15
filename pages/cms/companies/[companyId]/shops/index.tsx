import { getCmsCompanyShopsPageSsr } from 'db/ssr/shops/getCmsCompanyShopsPageSsr';
import CmsCompanyShopsPage from './[...filters]';

export const getServerSideProps = getCmsCompanyShopsPageSsr;
export default CmsCompanyShopsPage;
