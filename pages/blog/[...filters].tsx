import Breadcrumbs from 'components/Breadcrumbs';
import FormattedDateTime from 'components/FormattedDateTime';
import Icon from 'components/Icon';
import Inner from 'components/Inner';
import Link from 'components/Link/Link';
import Title from 'components/Title';
import { ROUTE_BLOG_POST, SORT_DESC } from 'config/common';
import { getConstantTranslation } from 'config/constantTranslations';
import { useConfigContext } from 'context/configContext';
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
  showViews: boolean;
}

const BlogListSnippet: React.FC<BlogListSnippetInterface> = ({ post, showViews }) => {
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

        {/*views counter*/}
        {showViews ? (
          <div className='flex items-center gap-3 mt-3'>
            <Icon className='w-5 h-5' name={'eye'} />
            <div>{post.views}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const BlogListMainSnippet: React.FC<BlogListSnippetInterface> = ({ post, showViews }) => {
  return (
    <div className='relative overflow-hidden rounded-md min-h-[300px] bg-secondary sm:col-span-2'>
      <img
        className='absolute h-full w-full inset-0 object-cover'
        src={post.previewImage || `${process.env.OBJECT_STORAGE_IMAGE_FALLBACK}`}
        alt={`${post.title}`}
        title={`${post.title}`}
      />

      <div className='absolute inset-0 w-full h-full flex flex-col justify-end z-10'>
        <div className='px-4 pb-6 pt-12 blog-post-image-cover'>
          {/*title*/}
          <div className='font-medium text-xl mb-3 text-white'>{post.title}</div>

          {/*date*/}
          <div className='text-secondary-text mb-3 text-wp-light-gray-100'>
            <FormattedDateTime value={post.createdAt} />
          </div>

          {/*description*/}
          <div className='text-white'>{post.description}</div>

          {/*views counter*/}
          {showViews ? (
            <div className='flex items-center gap-3 mt-3 text-white'>
              <Icon className='w-5 h-5' name={'eye'} />
              <div>{post.views}</div>
            </div>
          ) : null}
        </div>
      </div>

      <Link
        testId={`${post.title}-image-link`}
        className='block absolute z-20 inset-0 text-indent-full'
        href={`${ROUTE_BLOG_POST}/${post.slug}`}
      >
        {post.title}
      </Link>
    </div>
  );
};

interface BlogListPageConsumerInterface {
  posts: BlogPostInterface[];
}

const BlogListPageConsumer: React.FC<BlogListPageConsumerInterface> = ({ posts }) => {
  const { locale } = useLocaleContext();
  const { configs } = useConfigContext();
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
                return (
                  <BlogListMainSnippet
                    post={post}
                    showViews={configs.showBlogPostViews}
                    key={`${post._id}`}
                  />
                );
              }
              return (
                <BlogListSnippet
                  post={post}
                  showViews={configs.showBlogPostViews}
                  key={`${post._id}`}
                />
              );
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
        $addFields: {
          views: { $max: `$views.${props.companySlug}.${props.sessionCity}` },
          priorities: { $max: `$priorities.${props.companySlug}.${props.sessionCity}` },
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
