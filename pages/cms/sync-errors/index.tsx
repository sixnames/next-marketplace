import { getCmsSyncErrorsPageSsr } from 'db/ssr/shops/getCmsSyncErrorsPageSsr';
import CmsSyncErrorsPage from './[...filters]';

export const getServerSideProps = getCmsSyncErrorsPageSsr;
export default CmsSyncErrorsPage;
