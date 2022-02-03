import { getCmsSuppliersListPageSsr } from '../../../db/dao/ssr/getCmsSuppliersListPageSsr';
import CmsSuppliersListPage from './[...filters]';

export const getServerSideProps = getCmsSuppliersListPageSsr;
export default CmsSuppliersListPage;
