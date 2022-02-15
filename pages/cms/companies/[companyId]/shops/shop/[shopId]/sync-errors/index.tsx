import { getCmsCompanyShopSyncErrorsPageSsr } from 'db/ssr/shops/getCmsCompanyShopSyncErrorsPageSsr';
import CmsCompanyShopSyncErrorsPage from './[...filters]';

export const getServerSideProps = getCmsCompanyShopSyncErrorsPageSsr;
export default CmsCompanyShopSyncErrorsPage;
