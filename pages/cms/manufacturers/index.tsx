import { getCmsManufacturersListPageSsr } from '../../../db/dao/ssr/getCmsManufacturersListPageSsr';
import CmsManufacturersListPage from './[...filters]';

export const getServerSideProps = getCmsManufacturersListPageSsr;
export default CmsManufacturersListPage;
