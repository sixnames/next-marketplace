import Button from 'components/Button';
import FixedButtons from 'components/FixedButtons';
import FakeInput from 'components/FormElements/Input/FakeInput';
import FormikInput from 'components/FormElements/Input/FormikInput';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import FormikSelect from 'components/FormElements/Select/FormikSelect';
import WpImageUpload from 'components/FormElements/Upload/WpImageUpload';
import Inner from 'components/Inner';
import { AttributeOptionsModalInterface } from 'components/Modal/AttributeOptionsModal';
import PageEditor from 'components/PageEditor';
import Title from 'components/Title';
import {
  CATALOGUE_OPTION_SEPARATOR,
  DEFAULT_LOCALE,
  PAGE_STATE_OPTIONS,
  ROUTE_CMS,
  SORT_ASC,
} from 'config/common';
import { ATTRIBUTE_OPTIONS_MODAL } from 'config/modalVariants';
import { useAppContext } from 'context/appContext';
import { COL_BLOG_ATTRIBUTES, COL_BLOG_POSTS, COL_OPTIONS, COL_USERS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { BlogAttributeInterface, BlogPostInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import {
  useDeleteBlogPostPreviewImage,
  useUpdateBlogPost,
  useUpdateBlogPostAttribute,
  useUploadBlogPostAsset,
  useUploadBlogPostPreviewImage,
} from 'hooks/mutations/blog/useBlogMutations';
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
  attributes: BlogAttributeInterface[];
}

const sectionClassName = 'border-t border-border-color pt-8 mt-12';
const pageTitle = 'Блог';

const BlogPostConsumer: React.FC<BlogPostConsumerInterface> = ({ post, attributes }) => {
  const validationSchema = useValidationSchema({
    schema: updateBlogPostSchema,
  });
  const { showModal } = useAppContext();
  const [updateBlogPost] = useUpdateBlogPost();
  const [deleteBlogPostPreviewImage] = useDeleteBlogPostPreviewImage();
  const [uploadBlogPostPreviewImage] = useUploadBlogPostPreviewImage();
  const [uploadBlogPostAsset] = useUploadBlogPostAsset();
  const [updateBlogPostAttribute] = useUpdateBlogPostAttribute();

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
              }).catch(console.log);
            }}
          >
            {({ values, setFieldValue }) => {
              return (
                <Form>
                  <WpImageUpload
                    isRequired
                    label={'Превью изображение блог-поста'}
                    name={'previewImage'}
                    testId={'previewImage'}
                    width={'10rem'}
                    height={'10rem'}
                    previewUrl={post.previewImage}
                    removeImageHandler={() => {
                      deleteBlogPostPreviewImage({
                        blogPostId: `${post._id}`,
                      }).catch(console.log);
                    }}
                    uploadImageHandler={(files) => {
                      uploadBlogPostPreviewImage({
                        blogPostId: `${post._id}`,
                        assets: files,
                      }).catch(console.log);
                    }}
                  />

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

                  <FormikSelect
                    label={'Состояние'}
                    name={'state'}
                    testId={'state'}
                    options={PAGE_STATE_OPTIONS}
                    isRequired
                    showInlineError
                  />

                  <FormikInput name={'source'} testId={'source'} label={'Источник'} />

                  <div className={sectionClassName}>
                    <Title tag={'div'} size={'small'}>
                      Атрибуты блог-поста
                    </Title>

                    <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-x-8'>
                      {attributes.map((attribute) => {
                        return (
                          <FakeInput
                            value={`${attribute.readableValue}`}
                            label={`${attribute.name}`}
                            key={`${attribute._id}`}
                            testId={`${attribute.name}-attribute`}
                            onClear={
                              attribute.readableValue
                                ? () => {
                                    updateBlogPostAttribute({
                                      blogPostId: `${post._id}`,
                                      blogAttributeId: `${attribute._id}`,
                                      selectedOptionsIds: [],
                                    }).catch(console.log);
                                  }
                                : undefined
                            }
                            onClick={() => {
                              if (attribute.optionsGroupId) {
                                showModal<AttributeOptionsModalInterface>({
                                  variant: ATTRIBUTE_OPTIONS_MODAL,
                                  props: {
                                    testId: 'select-attribute-options-modal',
                                    optionsGroupId: `${attribute.optionsGroupId}`,
                                    optionVariant: 'checkbox',
                                    title: `${attribute.name}`,
                                    onSubmit: (value) => {
                                      updateBlogPostAttribute({
                                        blogPostId: `${post._id}`,
                                        blogAttributeId: `${attribute._id}`,
                                        selectedOptionsIds: value.map(({ _id }) => `${_id}`),
                                      }).catch(console.log);
                                    },
                                  },
                                });
                              }
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <div className={sectionClassName}>
                    <Title tag={'div'} size={'small'}>
                      Контент блог-поста
                    </Title>
                    <PageEditor
                      value={values.content}
                      setValue={(value) => {
                        setFieldValue('content', value);
                      }}
                      imageUpload={async (file) => {
                        const payload = await uploadBlogPostAsset({
                          blogPostId: `${post._id}`,
                          assets: [file],
                        });

                        if (payload) {
                          return {
                            url: payload.payload,
                          };
                        }
                        return {
                          url: '',
                        };
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

const BlogPostPage: React.FC<BlogPostPageInterface> = ({ post, pageUrls, attributes }) => {
  return (
    <CmsLayout pageUrls={pageUrls} title={pageTitle}>
      <BlogPostConsumer post={post} attributes={attributes} />
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
  const blogAttributesCollection = db.collection<BlogAttributeInterface>(COL_BLOG_ATTRIBUTES);

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

  const selectedOptionsSlugs = post.selectedOptionsSlugs.reduce((acc: string[], slug) => {
    const slugParts = slug.split(CATALOGUE_OPTION_SEPARATOR);
    const optionSlug = slugParts[1];
    if (!optionSlug) {
      return acc;
    }
    return [...acc, optionSlug];
  }, []);

  const initialBlogAttributesAggregation = await blogAttributesCollection
    .aggregate([
      {
        $sort: {
          [`nameI18n.${DEFAULT_LOCALE}`]: SORT_ASC,
        },
      },
      {
        $lookup: {
          as: 'options',
          from: COL_OPTIONS,
          let: {
            optionsGroupId: '$optionsGroupId',
          },
          pipeline: [
            {
              $match: {
                slug: {
                  $in: selectedOptionsSlugs,
                },
                $expr: {
                  $eq: ['$optionsGroupId', '$$optionsGroupId'],
                },
              },
            },
          ],
        },
      },
    ])
    .toArray();

  const attributes = initialBlogAttributesAggregation.map((attribute) => {
    const options = attribute.options
      ? attribute.options.map((option) => {
          return {
            ...option,
            name: getFieldStringLocale(option.nameI18n, props.sessionLocale),
          };
        })
      : null;
    const optionNames = (options || [])
      .filter((option) => {
        return option.slug;
      })
      .map(({ name }) => `${name}`);

    return {
      ...attribute,
      name: getFieldStringLocale(attribute.nameI18n, props.sessionLocale),
      options,
      readableValue: optionNames.join(', '),
    };
  });

  return {
    props: {
      ...props,
      post: castDbData(post),
      attributes: castDbData(attributes),
    },
  };
};

export default BlogPostPage;
