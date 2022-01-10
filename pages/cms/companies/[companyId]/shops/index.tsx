import { getCmsCompanyShopsPageSsr } from '../../../../../db/dao/ssr/getCmsCompanyShopsPageSsr';
import CmsCompanyShopsPage from './[...filters]';

export const getServerSideProps = getCmsCompanyShopsPageSsr;
export default CmsCompanyShopsPage;
