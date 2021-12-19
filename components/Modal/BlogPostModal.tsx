import * as React from 'react';
import { Formik, Form } from 'formik';
import { CreateBlogPostInputInterface } from '../../db/dao/blog/createBlogPost';
import { useCreateBlogPost } from '../../hooks/mutations/useBlogMutations';
import useValidationSchema from '../../hooks/useValidationSchema';
import { createBlogPostSchema } from '../../validation/blogSchema';
import WpButton from '../button/WpButton';
import FormikTranslationsInput from '../FormElements/Input/FormikTranslationsInput';
import ModalButtons from './ModalButtons';
import ModalFrame from './ModalFrame';
import ModalTitle from './ModalTitle';

export interface BlogPostModalInterface {
  companySlug: string;
  basePath: string;
}

const BlogPostModal: React.FC<BlogPostModalInterface> = ({ companySlug, basePath }) => {
  const [createBlogPostHandler] = useCreateBlogPost(basePath);
  const validationSchema = useValidationSchema({
    schema: createBlogPostSchema,
  });

  const initialValues: CreateBlogPostInputInterface = {
    titleI18n: {},
    descriptionI18n: {},
    companySlug: companySlug,
  };

  return (
    <ModalFrame testId={'blog-post-modal'}>
      <ModalTitle>Создание блог-поста</ModalTitle>

      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={(values) => {
          createBlogPostHandler({
            titleI18n: values.titleI18n,
            descriptionI18n: values.descriptionI18n,
            companySlug: values.companySlug,
          }).catch(console.log);
        }}
      >
        {() => {
          return (
            <Form>
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

              <ModalButtons>
                <WpButton testId={'blog-post-submit'} type={'submit'}>
                  Создать
                </WpButton>
              </ModalButtons>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default BlogPostModal;
