import { getCmsSuppliersListPageSsr } from 'db/ssr/suppliers/getCmsSuppliersListPageSsr';
import CmsSuppliersListPage from './[...filters]';

export const getServerSideProps = getCmsSuppliersListPageSsr;
export default CmsSuppliersListPage;
