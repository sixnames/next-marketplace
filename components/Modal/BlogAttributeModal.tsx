import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import { CreateBlogAttributeInputInterface } from 'db/dao/blog/createBlogAttribute';
import { BlogAttributeInterface } from 'db/uiInterfaces';
import { useCreateBlogAttribute } from 'hooks/mutations/blog/useBlogPostMutations';
import * as React from 'react';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import ModalButtons from 'components/Modal/ModalButtons';
import Button from 'components/Button';
import { Formik, Form } from 'formik';
import useValidationSchema from 'hooks/useValidationSchema';
import { createBlogAttributeSchema } from 'validation/blogSchema';

export interface BlogAttributeModalInterface {
  attribute?: BlogAttributeInterface;
}

const BlogAttributeModal: React.FC<BlogAttributeModalInterface> = ({ attribute }) => {
  const [createBlogPostHandler] = useCreateBlogAttribute();
  const validationSchema = useValidationSchema({
    schema: createBlogAttributeSchema,
  });

  const initialValues: CreateBlogAttributeInputInterface = {
    nameI18n: attribute?.nameI18n || {},
    optionsGroupId: attribute ? `${attribute?.optionsGroupId}` : null,
  };

  return (
    <ModalFrame testId={'blog-post-modal'}>
      <ModalTitle>Создание блог-поста</ModalTitle>

      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={(values) => {
          createBlogPostHandler({
            nameI18n: values.nameI18n,
            optionsGroupId: values.optionsGroupId,
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
              />

              <FormikTranslationsInput
                label={'Краткое описание'}
                name={'descriptionI18n'}
                testId={'description'}
                isRequired
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

export default BlogAttributeModal;
