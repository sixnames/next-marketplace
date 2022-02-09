import { getCmsBrandsListPageSsr } from 'db/dao/ssr/getCmsBrandsListPageSsr';
import CmsBrandsListPage from './[...filters]';

export const getServerSideProps = getCmsBrandsListPageSsr;
export default CmsBrandsListPage;
