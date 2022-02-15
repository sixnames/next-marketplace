import { getCmsCompanyShopProductsListPageSsr } from 'db/ssr/shops/getCmsCompanyShopProductsListPageSsr';
import CmsCompanyShopProductsListPage from './[...filters]';

export const getServerSideProps = getCmsCompanyShopProductsListPageSsr;
export default CmsCompanyShopProductsListPage;
