import { GetServerSidePropsResult, GetServerSidePropsContext } from 'next';
import * as React from 'react';
import BlogPostsList from '../../../components/blog/BlogPostsList';
import Inner from '../../../components/Inner';
import WpTitle from '../../../components/WpTitle';
import { DEFAULT_COMPANY_SLUG } from '../../../config/common';
import { getBlogPostsList } from '../../../db/dao/blog/getBlogPostsList';
import { BlogPostInterface } from '../../../db/uiInterfaces';
import AppContentWrapper from '../../../layout/AppContentWrapper';
import AppSubNav from '../../../layout/AppSubNav';
import ConsoleLayout from '../../../layout/cms/ConsoleLayout';
import { getCmsLinks } from '../../../lib/linkUtils';
import {
  castDbData,
  getAppInitialData,
  GetAppInitialDataPropsInterface,
} from '../../../lib/ssrUtils';
import { ClientNavItemInterface } from '../../../types/clientTypes';

interface BlogPostsListConsumerInterface {
  posts: BlogPostInterface[];
}

const pageTitle = 'Блог';

const BlogPostsListConsumer: React.FC<BlogPostsListConsumerInterface> = ({ posts }) => {
  const links = getCmsLinks({});
  const navConfig = React.useMemo<ClientNavItemInterface[]>(() => {
    return [
      {
        name: 'Блог',
        testId: 'sub-nav-blog',
        path: links.blog.parentLink,
        exact: true,
      },
      {
        name: 'Атрибуты',
        testId: 'sub-nav-attributes',
        path: links.blog.attributes,
        exact: true,
      },
    ];
  }, [links]);

  return (
    <AppContentWrapper testId={'posts-list'}>
      <Inner lowBottom>
        <WpTitle>{pageTitle}</WpTitle>
      </Inner>
      <AppSubNav navConfig={navConfig} />
      <Inner>
        <BlogPostsList posts={posts} basePath={links.root} companySlug={DEFAULT_COMPANY_SLUG} />
      </Inner>
    </AppContentWrapper>
  );
};

interface BlogPostsListPageInterface
  extends GetAppInitialDataPropsInterface,
    BlogPostsListConsumerInterface {}

const BlogPostsListPage: React.FC<BlogPostsListPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps} title={pageTitle}>
      <BlogPostsListConsumer {...props} />
    </ConsoleLayout>
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
    companySlug: DEFAULT_COMPANY_SLUG,
  });

  return {
    props: {
      ...props,
      posts: castDbData(posts),
    },
  };
};

export default BlogPostsListPage;
