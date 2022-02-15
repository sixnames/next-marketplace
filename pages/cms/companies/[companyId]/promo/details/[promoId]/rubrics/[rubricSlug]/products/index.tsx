import { getCmsPromoProductsListPageSsr } from 'db/ssr/promo/getCmsPromoProductsListPageSsr';
import CmsPromoProductsListPage from './[...filters]';

export const getServerSideProps = getCmsPromoProductsListPageSsr;
export default CmsPromoProductsListPage;
