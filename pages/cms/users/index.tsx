import { getCmsUsersListPageSsr } from 'db/dao/ssr/getCmsUsersListPageSsr';
import CmsUsersListPage from './[...filters]';

export const getServerSideProps = getCmsUsersListPageSsr;
export default CmsUsersListPage;
