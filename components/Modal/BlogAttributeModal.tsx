import * as React from 'react';
import { Formik, Form } from 'formik';
import { CreateBlogAttributeInputInterface } from '../../db/dao/blog/createBlogAttribute';
import { BlogAttributeInterface, OptionsGroupInterface } from '../../db/uiInterfaces';
import {
  useCreateBlogAttribute,
  useUpdateBlogAttribute,
} from '../../hooks/mutations/useBlogMutations';
import useValidationSchema from '../../hooks/useValidationSchema';
import { createBlogAttributeSchema } from '../../validation/blogSchema';
import WpButton from '../button/WpButton';
import FormikTranslationsInput from '../FormElements/Input/FormikTranslationsInput';
import FormikSelect from '../FormElements/Select/FormikSelect';
import ModalButtons from './ModalButtons';
import ModalFrame from './ModalFrame';
import ModalTitle from './ModalTitle';

export interface BlogAttributeModalInterface {
  attribute?: BlogAttributeInterface;
  optionGroups: OptionsGroupInterface[];
}

const BlogAttributeModal: React.FC<BlogAttributeModalInterface> = ({ attribute, optionGroups }) => {
  const [createBlogPostHandler] = useCreateBlogAttribute();
  const [updateBlogAttribute] = useUpdateBlogAttribute();
  const validationSchema = useValidationSchema({
    schema: createBlogAttributeSchema,
  });

  const initialValues: CreateBlogAttributeInputInterface = {
    nameI18n: attribute?.nameI18n || {},
    optionsGroupId: attribute ? `${attribute?.optionsGroupId}` : null,
  };

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
                options={optionGroups}
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
