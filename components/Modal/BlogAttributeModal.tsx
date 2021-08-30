import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import FormikSelect from 'components/FormElements/Select/FormikSelect';
import RequestError from 'components/RequestError';
import Spinner from 'components/Spinner';
import { CreateBlogAttributeInputInterface } from 'db/dao/blog/createBlogAttribute';
import { BlogAttributeInterface } from 'db/uiInterfaces';
import { useGetNewAttributeOptionsQuery } from 'generated/apolloComponents';
import {
  useCreateBlogAttribute,
  useUpdateBlogAttribute,
} from 'hooks/mutations/blog/useBlogMutations';
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
  const [updateBlogAttribute] = useUpdateBlogAttribute();
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
      <ModalTitle>{attribute ? 'Обновление' : 'Создание'} атрибута блога</ModalTitle>

      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={(values) => {
          if (attribute) {
            updateBlogAttribute({
              blogAttributeId: `${attribute._id}`,
              nameI18n: values.nameI18n,
              optionsGroupId: values.optionsGroupId,
            }).catch(console.log);
            return;
          }

          createBlogPostHandler({
            nameI18n: values.nameI18n,
            optionsGroupId: values.optionsGroupId,
          }).catch(console.log);
        }}
      >
        {() => {
          return (
            <Form>
              <FormikTranslationsInput
                label={'Название'}
                name={'nameI18n'}
                testId={'nameI18n'}
                isRequired
                showInlineError
              />

              <FormikSelect
                options={getAllOptionsGroups}
                label={'Группа опций'}
                name={'optionsGroupId'}
                testId={'optionsGroupId'}
                isRequired
                showInlineError
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
