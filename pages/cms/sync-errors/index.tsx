import { getCmsSyncErrorsPageSsr } from '../../../db/dao/ssr/getCmsSyncErrorsPageSsr';
import CmsSyncErrorsPage from './[...filters]';

export const getServerSideProps = getCmsSyncErrorsPageSsr;
export default CmsSyncErrorsPage;
