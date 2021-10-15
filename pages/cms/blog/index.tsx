import BlogPostsList from 'components/blog/BlogPostsList';
import Inner from 'components/Inner';
import Title from 'components/Title';
import { DEFAULT_COMPANY_SLUG, ROUTE_CMS } from 'config/common';
import { getBlogPostsList } from 'db/dao/blog/getBlogPostsList';
import { BlogPostInterface } from 'db/uiInterfaces';
import AppContentWrapper from 'layout/AppContentWrapper';
import AppSubNav from 'layout/AppSubNav';
import CmsLayout from 'layout/cms/CmsLayout';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsResult, GetServerSidePropsContext } from 'next';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { ClientNavItemInterface } from 'types/clientTypes';

interface BlogPostsListConsumerInterface {
  posts: BlogPostInterface[];
}

const pageTitle = 'Блог';

const BlogPostsListConsumer: React.FC<BlogPostsListConsumerInterface> = ({ posts }) => {
  const navConfig = React.useMemo<ClientNavItemInterface[]>(() => {
    return [
      {
        name: 'Блог',
        testId: 'sub-nav-blog',
        path: `${ROUTE_CMS}/blog`,
        exact: true,
      },
      {
        name: 'Атрибуты',
        testId: 'sub-nav-attributes',
        path: `${ROUTE_CMS}/blog/attributes`,
        exact: true,
      },
    ];
  }, []);

  return (
    <AppContentWrapper testId={'posts-list'}>
      <Inner lowBottom>
        <Title>{pageTitle}</Title>
      </Inner>
      <AppSubNav navConfig={navConfig} />
      <Inner>
        <BlogPostsList posts={posts} basePath={ROUTE_CMS} companySlug={DEFAULT_COMPANY_SLUG} />
      </Inner>
    </AppContentWrapper>
  );
};

interface BlogPostsListPageInterface extends PagePropsInterface, BlogPostsListConsumerInterface {}

const BlogPostsListPage: React.FC<BlogPostsListPageInterface> = ({ posts, pageUrls }) => {
  return (
    <CmsLayout pageUrls={pageUrls} title={pageTitle}>
      <BlogPostsListConsumer posts={posts} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<BlogPostsListPageInterface>> => {
  const { props } = await getAppInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const posts = await getBlogPostsList({
    locale: props.sessionLocale,
    companySlug: props.companySlug,
  });

  return {
    props: {
      ...props,
      posts: castDbData(posts),
    },
  };
};

export default BlogPostsListPage;
