import { getCompanyShopAddProductsListPageSsr } from '../../../../../../../../../../db/dao/ssr/getCompanyShopAddProductsListPageSsr';
import CompanyShopAddProductsListPage from './[...filters]';

export const getServerSideProps = getCompanyShopAddProductsListPageSsr;
export default CompanyShopAddProductsListPage;
