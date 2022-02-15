import { getCmsManufacturersListPageSsr } from 'db/ssr/manufacturers/getCmsManufacturersListPageSsr';
import CmsManufacturersListPage from './[...filters]';

export const getServerSideProps = getCmsManufacturersListPageSsr;
export default CmsManufacturersListPage;
