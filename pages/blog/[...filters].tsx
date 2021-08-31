import Breadcrumbs from 'components/Breadcrumbs';
import FormattedDateTime from 'components/FormattedDateTime';
import Inner from 'components/Inner';
import Link from 'components/Link/Link';
import Title from 'components/Title';
import { ROUTE_BLOG_POST, SORT_DESC } from 'config/common';
import { getConstantTranslation } from 'config/constantTranslations';
import { useLocaleContext } from 'context/localeContext';
import { COL_BLOG_POSTS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { BlogPostInterface } from 'db/uiInterfaces';
import SiteLayout from 'layout/SiteLayout/SiteLayout';
import { SiteLayoutProviderInterface } from 'layout/SiteLayoutProvider';
import { getFieldStringLocale } from 'lib/i18n';
import { castDbData, getSiteInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';

interface BlogListSnippetInterface {
  post: BlogPostInterface;
}

const BlogListSnippet: React.FC<BlogListSnippetInterface> = ({ post }) => {
  return (
    <div className='overflow-hidden rounded-md bg-secondary'>
      {/*image*/}
      <div className='relative overflow-hidden h-[200px]'>
        <img
          className='absolute h-full w-full inset-0 object-cover'
          src={post.previewImage || `${process.env.OBJECT_STORAGE_IMAGE_FALLBACK}`}
          alt={`${post.title}`}
          title={`${post.title}`}
        />
        <Link
          testId={`${post.title}-image-link`}
          className='block absolute z-20 inset-0 text-indent-full'
          href={`${ROUTE_BLOG_POST}/${post.slug}`}
        >
          {post.title}
        </Link>
      </div>

      <div className='px-4 py-6'>
        {/*title*/}
        <div className='font-medium text-lg mb-3'>
          <Link
            testId={`${post.title}-title-link`}
            className='block text-primary-text hover:no-underline'
            href={`${ROUTE_BLOG_POST}/${post.slug}`}
          >
            {post.title}
          </Link>
        </div>

        {/*date*/}
        <div className='text-secondary-text mb-3'>
          <FormattedDateTime value={post.createdAt} />
        </div>

        {/*description*/}
        <div>{post.description}</div>
      </div>
    </div>
  );
};

interface BlogListMainSnippetInterface {
  post: BlogPostInterface;
}

const BlogListMainSnippet: React.FC<BlogListMainSnippetInterface> = ({ post }) => {
  return (
    <div className='overflow-hidden rounded-md bg-secondary sm:col-span-2'>
      {/*image*/}
      <div className='relative overflow-hidden h-[200px]'>
        <img
          className='absolute h-full w-full inset-0 object-cover'
          src={post.previewImage || `${process.env.OBJECT_STORAGE_IMAGE_FALLBACK}`}
          alt={`${post.title}`}
          title={`${post.title}`}
        />
        <Link
          testId={`${post.title}-image-link`}
          className='block absolute z-20 inset-0 text-indent-full'
          href={`${ROUTE_BLOG_POST}/${post.slug}`}
        >
          {post.title}
        </Link>
      </div>

      <div className='px-4 py-6'>
        {/*title*/}
        <div className='font-medium text-lg mb-3'>
          <Link
            testId={`${post.title}-title-link`}
            className='block text-primary-text hover:no-underline'
            href={`${ROUTE_BLOG_POST}/${post.slug}`}
          >
            {post.title}
          </Link>
        </div>

        {/*date*/}
        <div className='text-secondary-text mb-3'>
          <FormattedDateTime value={post.createdAt} />
        </div>

        {/*description*/}
        <div>{post.description}</div>
      </div>
    </div>
  );
};

interface BlogListPageConsumerInterface {
  posts: BlogPostInterface[];
}

const BlogListPageConsumer: React.FC<BlogListPageConsumerInterface> = ({ posts }) => {
  const { locale } = useLocaleContext();
  const blogLinkName = getConstantTranslation(`nav.blog.${locale}`);

  return (
    <div className='mb-12'>
      <Breadcrumbs currentPageName={blogLinkName} />
      <Inner lowTop>
        <Title>{blogLinkName}</Title>
        {posts.length > 0 ? (
          <div className='grid gap-6 sm:grid-cols-2 md:grid-cols-3'>
            {posts.map((post, index) => {
              if (index === 0) {
                return <BlogListMainSnippet post={post} key={`${post._id}`} />;
              }
              return <BlogListSnippet post={post} key={`${post._id}`} />;
            })}
          </div>
        ) : (
          <div className='font-medium text-lg'>Мы пока готовым для Вас интересные стати :)</div>
        )}
      </Inner>
    </div>
  );
};

interface BlogListPageInterface
  extends SiteLayoutProviderInterface,
    BlogListPageConsumerInterface {}

const BlogListPage: React.FC<BlogListPageInterface> = ({ posts, ...props }) => {
  return (
    <SiteLayout {...props}>
      <BlogListPageConsumer posts={posts} />
    </SiteLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<BlogListPageInterface>> => {
  const { props } = await getSiteInitialData({
    context,
  });

  if (!props || !props.initialData.configs.showBlog) {
    return {
      notFound: true,
    };
  }

  const { db } = await getDatabase();
  const blogPostsCollection = db.collection<BlogPostInterface>(COL_BLOG_POSTS);

  const initialBlogPostsAggregation = await blogPostsCollection
    .aggregate([
      {
        $match: {
          companySlug: props.companySlug,
        },
      },
      {
        $sort: {
          createdAt: SORT_DESC,
        },
      },
      {
        $project: {
          content: false,
        },
      },
    ])
    .toArray();

  const posts: BlogPostInterface[] = initialBlogPostsAggregation.map((post) => {
    return {
      ...post,
      title: getFieldStringLocale(post.titleI18n, props.sessionLocale),
      description: getFieldStringLocale(post.descriptionI18n, props.sessionLocale),
    };
  });

  return {
    props: {
      ...props,
      posts: castDbData(posts),
    },
  };
};

export default BlogListPage;
