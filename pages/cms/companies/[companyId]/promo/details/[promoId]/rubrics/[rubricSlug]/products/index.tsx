import { getCmsPromoProductsListPageSsr } from '../../../../../../../../../../db/dao/ssr/getCmsPromoProductsListPageSsr';
import CmsPromoProductsListPage from './[...filters]';

export const getServerSideProps = getCmsPromoProductsListPageSsr;
export default CmsPromoProductsListPage;
