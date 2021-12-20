import * as React from 'react';
import { Formik, Form } from 'formik';
import { CreateBlogAttributeInputInterface } from '../../db/dao/blog/createBlogAttribute';
import { BlogAttributeInterface } from '../../db/uiInterfaces';
import { useGetNewAttributeOptionsQuery } from '../../generated/apolloComponents';
import {
  useCreateBlogAttribute,
  useUpdateBlogAttribute,
} from '../../hooks/mutations/useBlogMutations';
import useValidationSchema from '../../hooks/useValidationSchema';
import { createBlogAttributeSchema } from '../../validation/blogSchema';
import WpButton from '../button/WpButton';
import FormikTranslationsInput from '../FormElements/Input/FormikTranslationsInput';
import FormikSelect from '../FormElements/Select/FormikSelect';
import RequestError from '../RequestError';
import Spinner from '../Spinner';
import ModalButtons from './ModalButtons';
import ModalFrame from './ModalFrame';
import ModalTitle from './ModalTitle';

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
                <WpButton testId={'blog-attribute-submit'} type={'submit'}>
                  {attribute ? 'Обновить' : 'Создать'}
                </WpButton>
              </ModalButtons>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default BlogAttributeModal;
