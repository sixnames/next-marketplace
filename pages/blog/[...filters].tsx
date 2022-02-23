import { useAppContext } from 'components/context/appContext';
import { useConfigContext } from 'components/context/configContext';
import { UpdateBlogAttributeCountersInputInterface } from 'db/dao/blog/updateBlogAttributeCounters';
import { getCatalogueBlogSsr } from 'db/ssr/blog/getCatalogueBlogSsr';
import {
  BlogAttributeInterface,
  BlogPostInterface,
  CatalogueFilterAttributeInterface,
} from 'db/uiInterfaces';
import { alwaysArray } from 'lib/arrayUtils';
import { FILTER_SEPARATOR, REQUEST_METHOD_POST } from 'lib/config/common';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { useRouter } from 'next/router';
import * as React from 'react';
import FormattedDate from '../../components/FormattedDate';
import Inner from '../../components/Inner';
import SiteLayout, { SiteLayoutProviderInterface } from '../../components/layout/SiteLayout';
import FilterLink from '../../components/Link/FilterLink';
import TagLink from '../../components/Link/TagLink';
import WpLink from '../../components/Link/WpLink';
import WpBreadcrumbs from '../../components/WpBreadcrumbs';
import WpIcon from '../../components/WpIcon';
import WpImage from '../../components/WpImage';
import WpTitle from '../../components/WpTitle';

const links = getProjectLinks();

interface BlogListSnippetMetaInterface {
  createdAt?: string | Date | null;
  viewsCount?: number | null;
  likesCount?: number | null;
  showViews: boolean;
  isLight?: boolean;
}

const BlogListSnippetMeta: React.FC<BlogListSnippetMetaInterface> = ({
  showViews,
  createdAt,
  viewsCount,
  likesCount,
  isLight,
}) => {
  return (
    <div
      className={`items center mb-3 flex flex-wrap gap-5 ${
        isLight ? 'text-white' : 'text-secondary-text'
      }`}
    >
      <FormattedDate value={createdAt} />
      {/*views counter*/}
      {showViews ? (
        <div className='flex items-center gap-2'>
          <WpIcon className='h-5 w-5' name={'eye'} />
          <div>{viewsCount}</div>
        </div>
      ) : null}

      {/*likes counter*/}
      {likesCount ? (
        <div className='flex items-center gap-2'>
          <WpIcon className='h-4 w-4' name={'like'} />
          <div>{likesCount}</div>
        </div>
      ) : null}
    </div>
  );
};

interface BlogListSnippetTagsInterface {
  attributes?: BlogAttributeInterface[] | null;
  theme?: 'primary' | 'secondary';
}

export const BlogListSnippetTags: React.FC<BlogListSnippetTagsInterface> = ({
  attributes,
  theme,
}) => {
  if (!attributes) {
    return null;
  }
  return (
    <div className='mt-3 flex flex-wrap gap-3'>
      {attributes.map((attribute) => {
        if (!attribute.options || attribute.options.length < 1) {
          return null;
        }
        return (
          <React.Fragment key={`${attribute._id}`}>
            {attribute.options.map((option) => {
              return (
                <TagLink
                  size={'small'}
                  href={`${links.blog.url}/${attribute.slug}${FILTER_SEPARATOR}${option.slug}`}
                  theme={theme}
                  key={`${option._id}`}
                >
                  #{option.name}
                </TagLink>
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const snippetClassName = `group relative overflow-hidden rounded-md bg-secondary hover:shadow-2xl transition-shadow duration-150`;

interface BlogListSnippetInterface {
  post: BlogPostInterface;
  showViews: boolean;
}

const BlogListSnippet: React.FC<BlogListSnippetInterface> = ({ post, showViews }) => {
  return (
    <div className={`${snippetClassName} flex flex-col`}>
      {/*image*/}
      <div className='relative h-[200px] flex-shrink-0 overflow-hidden transition-opacity duration-150 group-hover:opacity-50'>
        <WpImage
          className='absolute inset-0 h-full w-full object-cover'
          url={`${post.previewImage}`}
          alt={`${post.title}`}
          title={`${post.title}`}
          width={295}
        />
        <WpLink
          testId={`${post.title}-image-link`}
          className='text-indent-full absolute inset-0 z-20 block'
          href={`${links.blog.post.url}/${post.slug}`}
        >
          {post.title}
        </WpLink>
      </div>

      <div className='flex-grow-1 flex h-full flex-col px-4 py-6'>
        {/*title*/}
        <div className='mb-3 text-lg font-medium'>
          <WpLink
            testId={`${post.title}-title-link`}
            className='block text-primary-text hover:no-underline'
            href={`${links.blog.post.url}/${post.slug}`}
          >
            {post.title}
          </WpLink>
        </div>

        {/*meta*/}
        <BlogListSnippetMeta
          showViews={showViews}
          createdAt={post.createdAt}
          viewsCount={post.views}
          likesCount={post.likesCount}
        />

        {/*description*/}
        <div>{post.description}</div>

        {/*tags*/}
        <div className='mt-auto'>
          <BlogListSnippetTags theme={'primary'} attributes={post.attributes} />
        </div>
      </div>
    </div>
  );
};

const BlogListMainSnippet: React.FC<BlogListSnippetInterface> = ({ post, showViews }) => {
  return (
    <div className={`${snippetClassName} min-h-[300px] sm:col-span-2`}>
      <WpImage
        className='absolute inset-0 h-full w-full object-cover'
        url={`${post.previewImage}`}
        alt={`${post.title}`}
        title={`${post.title}`}
        width={600}
      />

      <div className='absolute inset-0 z-10 flex h-full w-full flex-col justify-end'>
        <div className='blog-post-image-cover px-4 pb-6 pt-12'>
          {/*title*/}
          <div className='mb-3 text-xl font-medium text-white'>{post.title}</div>

          {/*meta*/}
          <BlogListSnippetMeta
            isLight
            showViews={showViews}
            createdAt={post.createdAt}
            viewsCount={post.views}
            likesCount={post.likesCount}
          />

          {/*description*/}
          <div className='text-white'>{post.description}</div>

          {/*tags*/}
          <BlogListSnippetTags attributes={post.attributes} />
        </div>
      </div>

      <WpLink
        testId={`${post.title}-image-link`}
        className='text-indent-full absolute inset-0 z-20 block'
        href={`${links.blog.post.url}/${post.slug}`}
      >
        {post.title}
      </WpLink>
    </div>
  );
};

const BlogListTopSnippet: React.FC<BlogListSnippetInterface> = ({ post, showViews }) => {
  return (
    <div className='py-4'>
      {/*title*/}
      <div className='mb-3 text-lg font-medium'>
        <WpLink
          testId={`${post.title}-title-link`}
          className='block text-primary-text hover:no-underline'
          href={`${links.blog.post.url}/${post.slug}`}
        >
          {post.title}
        </WpLink>
      </div>

      <div className='mt-3'>
        {/*meta*/}
        <BlogListSnippetMeta
          showViews={showViews}
          createdAt={post.createdAt}
          viewsCount={post.views}
          likesCount={post.likesCount}
        />
      </div>
    </div>
  );
};

interface BlogFilterAttributeInterface {
  attribute: CatalogueFilterAttributeInterface;
  attributeIndex: number;
}

const BlogFilterAttribute: React.FC<BlogFilterAttributeInterface> = ({
  attribute,
  attributeIndex,
}) => {
  const { name, clearSlug, options, isSelected } = attribute;

  return (
    <div className='mb-12'>
      <div className='mb-4 flex items-baseline justify-between'>
        <span className='text-lg font-bold'>{name}</span>
        {isSelected ? (
          <WpLink href={`${clearSlug}`} className='font-medium text-theme'>
            Сбросить
          </WpLink>
        ) : null}
      </div>

      <div className='flex flex-wrap gap-2'>
        {options.map((option, optionIndex) => {
          const testId = `catalogue-option-${attributeIndex}-${optionIndex}`;
          return <FilterLink size={'small'} option={option} key={option.slug} testId={testId} />;
        })}
      </div>
    </div>
  );
};

interface BlogFilterInterface {
  blogFilter: CatalogueFilterAttributeInterface[];
  // isFilterVisible: boolean;
}

const BlogFilter: React.FC<BlogFilterInterface> = ({ blogFilter }) => {
  /*if (!isFilterVisible) {
    return null;
  }*/
  return (
    <React.Fragment>
      {blogFilter.map((attribute, index) => {
        return (
          <BlogFilterAttribute
            attribute={attribute}
            attributeIndex={index}
            key={`${attribute._id}`}
          />
        );
      })}
    </React.Fragment>
  );
};

interface BlogListPageConsumerInterface extends BlogFilterInterface {
  posts: BlogPostInterface[];
  topPosts: BlogPostInterface[];
  blogTitle: string;
}

const BlogListPageConsumer: React.FC<BlogListPageConsumerInterface> = ({
  posts,
  topPosts,
  blogFilter,
  blogTitle,
}) => {
  const { query } = useRouter();
  const { sessionCity, companySlug } = useAppContext();
  const { configs } = useConfigContext();

  React.useEffect(() => {
    const input: UpdateBlogAttributeCountersInputInterface = {
      filters: alwaysArray(query.filters),
      sessionCity,
      companySlug,
    };
    fetch(`/api/blog/update-attribute-counters`, {
      body: JSON.stringify(input),
      method: REQUEST_METHOD_POST,
    }).catch(console.log);
  }, [companySlug, query.filters, sessionCity]);

  return (
    <React.Fragment>
      <div className='mb-12'>
        <WpBreadcrumbs currentPageName={blogTitle} />
        <Inner lowTop>
          <WpTitle>{blogTitle}</WpTitle>

          {posts.length > 0 ? (
            <div className={`grid gap-6 lg:grid-cols-4`}>
              <div className={`col-span-3 grid gap-6 sm:grid-cols-2 md:grid-cols-3`}>
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

              <div className='relative col-span-3 lg:col-span-1'>
                <div className='absolute relative inset-0 h-full w-full overflow-y-auto overflow-x-hidden lg:sticky lg:top-20 lg:h-[calc(100vh-80px)]'>
                  <div className='pb-8'>
                    <BlogFilter blogFilter={blogFilter} />

                    {/*top posts*/}
                    <div className='rounded-md border border-border-100 py-6 px-4'>
                      <div className='mb-4 text-lg font-bold'>Самые читаемые</div>

                      {topPosts.length > 0 ? (
                        <div className='divide-y-2 divide-border-100'>
                          {topPosts.map((post) => {
                            return (
                              <BlogListTopSnippet
                                showViews={configs.showBlogPostViews}
                                post={post}
                                key={`${post._id}`}
                              />
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className='text-lg font-medium'>Мы пока готовим для Вас интересные статьи :)</div>
          )}
        </Inner>
      </div>
    </React.Fragment>
  );
};

export interface BlogListPageInterface
  extends SiteLayoutProviderInterface,
    BlogListPageConsumerInterface {}

const BlogListPage: React.FC<BlogListPageInterface> = ({
  posts,
  blogFilter,
  topPosts,
  blogTitle,
  ...props
}) => {
  const { configs } = useConfigContext();

  // meta title
  const titlePrefixConfig = configs.blogTitleMetaPrefix;
  const titlePostfixConfig = configs.blogTitleMetaPostfix;
  const titlePrefix = titlePrefixConfig ? `${titlePrefixConfig} ` : '';
  const titlePostfix = titlePostfixConfig ? ` ${titlePostfixConfig}` : '';
  const title = `${titlePrefix}${blogTitle}${titlePostfix}`;

  // description
  const descriptionPrefixConfig = configs.blogDescriptionMetaPrefix;
  const descriptionPostfixConfig = configs.blogDescriptionMetaPostfix;
  const descriptionPrefix = descriptionPrefixConfig ? `${descriptionPrefixConfig} ` : '';
  const descriptionPostfix = descriptionPostfixConfig ? ` ${descriptionPostfixConfig}` : '';
  const description = `${descriptionPrefix}${blogTitle}${descriptionPostfix}`;

  return (
    <SiteLayout {...props} title={title} description={description}>
      <BlogListPageConsumer
        topPosts={topPosts}
        blogFilter={blogFilter}
        posts={posts}
        blogTitle={blogTitle}
      />
    </SiteLayout>
  );
};

export const getServerSideProps = getCatalogueBlogSsr;
export default BlogListPage;
