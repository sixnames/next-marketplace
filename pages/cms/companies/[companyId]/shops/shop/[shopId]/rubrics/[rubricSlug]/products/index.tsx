import { getCmsCompanyShopProductsListPageSsr } from '../../../../../../../../../../db/dao/ssr/getCmsCompanyShopProductsListPageSsr';
import CmsCompanyShopProductsListPage from './[...filters]';

export const getServerSideProps = getCmsCompanyShopProductsListPageSsr;
export default CmsCompanyShopProductsListPage;
