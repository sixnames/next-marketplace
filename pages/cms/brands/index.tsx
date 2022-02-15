import { getCmsBrandsListPageSsr } from 'db/ssr/brands/getCmsBrandsListPageSsr';
import CmsBrandsListPage from './[...filters]';

export const getServerSideProps = getCmsBrandsListPageSsr;
export default CmsBrandsListPage;
