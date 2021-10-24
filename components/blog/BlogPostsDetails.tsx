import Button from 'components/Button';
import FixedButtons from 'components/FixedButtons';
import FakeInput from 'components/FormElements/Input/FakeInput';
import FormikInput from 'components/FormElements/Input/FormikInput';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import FormikSelect from 'components/FormElements/Select/FormikSelect';
import WpImageUpload from 'components/FormElements/Upload/WpImageUpload';
import { AttributeOptionsModalInterface } from 'components/Modal/AttributeOptionsModal';
import PageEditor from 'components/PageEditor';
import Title from 'components/Title';
import { PAGE_STATE_OPTIONS, REQUEST_METHOD_PATCH } from 'config/common';
import { ATTRIBUTE_OPTIONS_MODAL } from 'config/modalVariants';
import { useAppContext } from 'context/appContext';
import { useNotificationsContext } from 'context/notificationsContext';
import { BlogAttributeInterface, BlogPostInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import {
  useDeleteBlogPostPreviewImage,
  useUpdateBlogPost,
  useUpdateBlogPostAttribute,
} from 'hooks/mutations/useBlogMutations';
import useValidationSchema from 'hooks/useValidationSchema';
import { useRouter } from 'next/router';
import * as React from 'react';
import { updateBlogPostSchema } from 'validation/blogSchema';

const sectionClassName = 'border-t border-border-300 pt-8 mt-12';

interface BlogPostsDetailsInterface {
  post: BlogPostInterface;
  attributes: BlogAttributeInterface[];
}

const BlogPostsDetails: React.FC<BlogPostsDetailsInterface> = ({ post, attributes }) => {
  const router = useRouter();
  const validationSchema = useValidationSchema({
    schema: updateBlogPostSchema,
  });
  const { showErrorNotification } = useNotificationsContext();
  const { showModal, showLoading, hideLoading } = useAppContext();
  const [updateBlogPost] = useUpdateBlogPost();
  const [deleteBlogPostPreviewImage] = useDeleteBlogPostPreviewImage();
  const [updateBlogPostAttribute] = useUpdateBlogPostAttribute();

  return (
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
                  showLoading();
                  const formData = new FormData();
                  formData.append('assets', files[0]);
                  formData.append('blogPostId', `${post._id}`);

                  fetch('/api/blog/post-preview-image', {
                    method: REQUEST_METHOD_PATCH,
                    body: formData,
                  })
                    .then((res) => {
                      return res.json();
                    })
                    .then((json) => {
                      if (json.success) {
                        router.reload();
                        return;
                      }
                      hideLoading();
                      showErrorNotification({ title: json.message });
                    })
                    .catch((e) => {
                      console.log(e);
                      hideLoading();
                      showErrorNotification({ title: 'error' });
                    });
                }}
              />

              <FormikTranslationsInput
                label={'Заголовок'}
                name={'titleI18n'}
                testId={'titleI18n'}
                isRequired
                showInlineError
              />

              <FormikTranslationsInput
                label={'Краткое описание'}
                name={'descriptionI18n'}
                testId={'descriptionI18n'}
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

              {attributes.length > 0 ? (
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
                                  notShowAsAlphabet: true,
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
              ) : null}

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
                    try {
                      const formData = new FormData();
                      formData.append('assets', file);
                      formData.append('blogPostId', `${post._id}`);

                      const responseFetch = await fetch('/api/blog/add-post-asset', {
                        method: REQUEST_METHOD_PATCH,
                        body: formData,
                      });
                      const responseJson = await responseFetch.json();

                      return {
                        url: responseJson.payload,
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
  );
};

export default BlogPostsDetails;
