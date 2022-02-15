import { getCatalogueBlogSsr } from 'db/ssr/blog/getCatalogueBlogSsr';
import BlogListPage from './[...filters]';

export const getServerSideProps = getCatalogueBlogSsr;
export default BlogListPage;
