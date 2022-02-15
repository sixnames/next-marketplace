import { getCompanyShopAddProductsListPageSsr } from 'db/ssr/shops/getCompanyShopAddProductsListPageSsr';
import CompanyShopAddProductsListPage from './[...filters]';

export const getServerSideProps = getCompanyShopAddProductsListPageSsr;
export default CompanyShopAddProductsListPage;
