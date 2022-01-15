import { getCatalogueBlogSsr } from '../../db/dao/ssr/getCatalogueBlogSsr';
import BlogListPage from './[...filters]';

export const getServerSideProps = getCatalogueBlogSsr;
export default BlogListPage;
