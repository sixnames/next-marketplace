import { getCmsBrandCollectionsPageSsr } from 'db/ssr/brands/getCmsBrandCollectionsPageSsr';
import CmsBrandCollectionsPage from './[...filters]';

export const getServerSideProps = getCmsBrandCollectionsPageSsr;
export default CmsBrandCollectionsPage;
