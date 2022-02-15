import { getCmsUsersListPageSsr } from 'db/ssr/users/getCmsUsersListPageSsr';
import CmsUsersListPage from './[...filters]';

export const getServerSideProps = getCmsUsersListPageSsr;
export default CmsUsersListPage;
