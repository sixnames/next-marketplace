import Button from 'components/Button';
import FixedButtons from 'components/FixedButtons';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import Inner from 'components/Inner';
import PageEditor from 'components/PageEditor';
import Title from 'components/Title';
import { REQUEST_METHOD_POST, ROUTE_CMS } from 'config/common';
import { COL_BLOG_POSTS, COL_USERS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { BlogPostInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import { useUpdateBlogPost } from 'hooks/mutations/blog/useBlogMutations';
import useValidationSchema from 'hooks/useValidationSchema';
import AppContentWrapper, { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { getFullName } from 'lib/nameUtils';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsResult, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { updateBlogPostSchema } from 'validation/blogSchema';

interface BlogPostConsumerInterface {
  post: BlogPostInterface;
}

const sectionClassName = 'border-t border-border-color pt-8 mt-12';
const pageTitle = 'Блог';

const BlogPostConsumer: React.FC<BlogPostConsumerInterface> = ({ post }) => {
  const validationSchema = useValidationSchema({
    schema: updateBlogPostSchema,
  });
  const [updateBlogPost] = useUpdateBlogPost();
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${post.title}`,
    config: [
      {
        name: 'Блог',
        href: `${ROUTE_CMS}/blog`,
      },
    ],
  };

  return (
    <AppContentWrapper testId={'post-details'} breadcrumbs={breadcrumbs}>
      <Head>
        <title>{post.title}</title>
      </Head>
      <Inner lowBottom>
        <Title>{post.title}</Title>
      </Inner>

      <Inner>
        <div className='relative'>
          <Formik
            validationSchema={validationSchema}
            initialValues={{
              blogPostId: `${post._id}`,
              content: JSON.parse(post.content),
              descriptionI18n: post.descriptionI18n,
              source: post.source,
              state: post.state,
              titleI18n: post.titleI18n,
            }}
            onSubmit={(values) => {
              updateBlogPost({
                blogPostId: values.blogPostId,
                content: JSON.stringify(values.content),
                descriptionI18n: values.descriptionI18n,
                source: values.source,
                state: values.state,
                titleI18n: values.titleI18n,
              });
            }}
          >
            {({ values, setFieldValue }) => {
              return (
                <Form>
                  <FormikTranslationsInput
                    label={'Заголовок'}
                    name={'titleI18n'}
                    testId={'title'}
                    isRequired
                    showInlineError
                  />

                  <FormikTranslationsInput
                    label={'Краткое описание'}
                    name={'descriptionI18n'}
                    testId={'description'}
                    isRequired
                    showInlineError
                  />

                  <div className={sectionClassName}>
                    <Title tag={'div'} size={'small'}>
                      Контент страницы
                    </Title>
                    <PageEditor
                      value={values.content}
                      setValue={(value) => {
                        setFieldValue('content', value);
                      }}
                      imageUpload={async (file) => {
                        try {
                          const formData = new FormData();
                          formData.append('pageId', `${post._id}`);
                          formData.append('assets', file);

                          const responseFetch = await fetch('/api/blog/add-post-asset', {
                            method: REQUEST_METHOD_POST,
                            body: formData,
                          });
                          const responseJson = await responseFetch.json();

                          return {
                            url: responseJson.url,
                          };
                        } catch (e) {
                          console.log(e);
                          return {
                            url: '',
                          };
                        }
                      }}
                    />
                  </div>

                  <FixedButtons>
                    <Button testId={`submit-blog-post`} size={'small'} type={'submit'}>
                      Сохранить
                    </Button>
                  </FixedButtons>
                </Form>
              );
            }}
          </Formik>
        </div>
      </Inner>
    </AppContentWrapper>
  );
};

interface BlogPostPageInterface extends PagePropsInterface, BlogPostConsumerInterface {}

const BlogPostPage: React.FC<BlogPostPageInterface> = ({ post, pageUrls }) => {
  return (
    <CmsLayout pageUrls={pageUrls} title={pageTitle}>
      <BlogPostConsumer post={post} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<BlogPostPageInterface>> => {
  const { props } = await getAppInitialData({ context });
  if (!props || !context.query.blogPostId) {
    return {
      notFound: true,
    };
  }

  const { db } = await getDatabase();
  const blogPostsCollection = db.collection<BlogPostInterface>(COL_BLOG_POSTS);

  const initialBlogPostAggregation = await blogPostsCollection
    .aggregate([
      {
        $match: {
          _id: new ObjectId(`${context.query.blogPostId}`),
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

  const initialPost = initialBlogPostAggregation[0];
  if (!initialPost) {
    return {
      notFound: true,
    };
  }

  const post: BlogPostInterface = {
    ...initialPost,
    title: getFieldStringLocale(initialPost.titleI18n, props.sessionLocale),
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
