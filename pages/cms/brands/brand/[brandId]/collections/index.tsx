import { getCmsBrandCollectionsPageSsr } from '../../../../../../db/dao/ssr/getCmsBrandCollectionsPageSsr';
import CmsBrandCollectionsPage from './[...filters]';

export const getServerSideProps = getCmsBrandCollectionsPageSsr;
export default CmsBrandCollectionsPage;
