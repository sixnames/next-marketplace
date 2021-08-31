import Breadcrumbs from 'components/Breadcrumbs';
import Inner from 'components/Inner';
import PageEditor from 'components/PageEditor';
import { ROUTE_BLOG_WITH_PAGE, VIEWS_COUNTER_STEP } from 'config/common';
import { getConstantTranslation } from 'config/constantTranslations';
import { useLocaleContext } from 'context/localeContext';
import { COL_BLOG_POSTS, COL_USERS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { BlogPostInterface } from 'db/uiInterfaces';
import SiteLayout from 'layout/SiteLayout/SiteLayout';
import { SiteLayoutProviderInterface } from 'layout/SiteLayoutProvider';
import { getFieldStringLocale } from 'lib/i18n';
import { getFullName } from 'lib/nameUtils';
import { castDbData, getSiteInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';

interface BlogPostPageConsumerInterface {
  post: BlogPostInterface;
}

const BlogPostPageConsumer: React.FC<BlogPostPageConsumerInterface> = ({ post }) => {
  const { locale } = useLocaleContext();
  const blogLinkName = getConstantTranslation(`nav.blog.${locale}`);

  return (
    <div className='mb-12'>
      <Breadcrumbs
        currentPageName={`${post.title}`}
        config={[
          {
            name: blogLinkName,
            href: ROUTE_BLOG_WITH_PAGE,
          },
        ]}
      />
      <Inner lowTop>
        <PageEditor value={JSON.parse(post.content)} readOnly />
      </Inner>
    </div>
  );
};

interface BlogPostPageInterface
  extends SiteLayoutProviderInterface,
    BlogPostPageConsumerInterface {}

const BlogPostPage: React.FC<BlogPostPageInterface> = ({ post, ...props }) => {
  return (
    <SiteLayout {...props} title={`${post.title}`} description={`${post.description}`}>
      <BlogPostPageConsumer post={post} />
    </SiteLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<BlogPostPageInterface>> => {
  const { query } = context;
  const { blogPostSlug } = query;
  const { props } = await getSiteInitialData({
    context,
  });

  if (!props || !props.initialData.configs.showBlog || !blogPostSlug) {
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
          slug: blogPostSlug,
        },
      },
      {
        $lookup: {
          as: 'author',
          from: COL_USERS,
          let: {
            authorId: '$authorId',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$authorId'],
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          author: {
            $arrayElemAt: ['$author', 0],
          },
        },
      },
    ])
    .toArray();
  const initialPost = initialBlogPostsAggregation[0];
  if (!initialPost) {
    return {
      notFound: true,
    };
  }

  // update post counter
  const isStaff = props.sessionUser?.role?.isStaff;
  if (!isStaff) {
    await blogPostsCollection.findOneAndUpdate(
      { _id: initialPost._id },
      {
        $inc: {
          [`views.${props.companySlug}.${props.sessionCity}`]: VIEWS_COUNTER_STEP,
        },
      },
    );
  }

  const post: BlogPostInterface = {
    ...initialPost,
    title: getFieldStringLocale(initialPost.titleI18n, props.sessionLocale),
    description: getFieldStringLocale(initialPost.descriptionI18n, props.sessionLocale),
    author: initialPost.author
      ? {
          ...initialPost.author,
          fullName: getFullName(initialPost.author),
        }
      : null,
  };

  return {
    props: {
      ...props,
      post: castDbData(post),
    },
  };
};

export default BlogPostPage;
