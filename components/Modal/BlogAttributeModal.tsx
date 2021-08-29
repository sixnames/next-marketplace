import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import FormikSelect from 'components/FormElements/Select/FormikSelect';
import RequestError from 'components/RequestError';
import Spinner from 'components/Spinner';
import { CreateBlogAttributeInputInterface } from 'db/dao/blog/createBlogAttribute';
import { BlogAttributeInterface } from 'db/uiInterfaces';
import { useGetNewAttributeOptionsQuery } from 'generated/apolloComponents';
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

  const { data, loading, error } = useGetNewAttributeOptionsQuery();

  const initialValues: CreateBlogAttributeInputInterface = {
    nameI18n: attribute?.nameI18n || {},
    optionsGroupId: attribute ? `${attribute?.optionsGroupId}` : null,
  };

  if (loading) {
    return <Spinner />;
  }

  if (error || !data) {
    return (
      <ModalFrame>
        <RequestError />
      </ModalFrame>
    );
  }

  const { getAllOptionsGroups } = data;

  return (
    <ModalFrame testId={'blog-attribute-modal'}>
      <ModalTitle>Создание атрибута блога</ModalTitle>

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
                label={'Название'}
                name={'nameI18n'}
                testId={'name'}
                isRequired
              />

              <FormikSelect
                options={getAllOptionsGroups}
                label={'Группа опций'}
                name={'optionsGroupId'}
                testId={'optionsGroupId'}
                isRequired
              />

              <ModalButtons>
                <Button testId={'blog-attribute-submit'} type={'submit'}>
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
