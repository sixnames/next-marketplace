import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import { CreateBlogPostInputInterface } from 'db/dao/blog/createBlogPost';
import { useCreateBlogPost } from 'hooks/mutations/blog/useBlogMutations';
import * as React from 'react';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import ModalButtons from 'components/Modal/ModalButtons';
import Button from 'components/Button';
import { Formik, Form } from 'formik';
import useValidationSchema from 'hooks/useValidationSchema';
import { createBlogPostSchema } from 'validation/blogSchema';

export interface BlogPostModalInterface {
  companySlug: string;
}

const BlogPostModal: React.FC<BlogPostModalInterface> = ({ companySlug }) => {
  const [createBlogPostHandler] = useCreateBlogPost();
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
          });
        }}
      >
        {() => {
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

              <ModalButtons>
                <Button testId={'blog-post-submit'} type={'submit'}>
                  Создать
                </Button>
              </ModalButtons>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default BlogPostModal;
