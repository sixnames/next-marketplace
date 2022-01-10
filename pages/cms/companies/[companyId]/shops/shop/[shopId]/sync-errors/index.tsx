import { getCmsCompanyShopSyncErrorsPageSsr } from '../../../../../../../../db/dao/ssr/getCmsCompanyShopSyncErrorsPageSsr';
import CmsCompanyShopSyncErrorsPage from './[...filters]';

export const getServerSideProps = getCmsCompanyShopSyncErrorsPageSsr;
export default CmsCompanyShopSyncErrorsPage;
