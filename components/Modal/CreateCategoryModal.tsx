import * as React from 'react';
import { Form, Formik } from 'formik';
import { GENDER_ENUMS } from '../../config/common';
import { OptionVariantsModel } from '../../db/dbModels';
import { CreateCategoryInput, useCreateCategoryMutation } from '../../generated/apolloComponents';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import useValidationSchema from '../../hooks/useValidationSchema';
import { createCategorySchema } from '../../validation/categorySchema';
import WpButton from '../button/WpButton';
import CategoryMainFields from '../FormTemplates/CategoryMainFields';
import ModalButtons from './ModalButtons';
import ModalFrame from './ModalFrame';
import ModalTitle from './ModalTitle';

export interface CreateCategoryModalInterface {
  parentId?: string | null;
  rubricId: string;
}

const CreateCategoryModal: React.FC<CreateCategoryModalInterface> = ({ parentId, rubricId }) => {
  const { onCompleteCallback, onErrorCallback, showLoading, hideModal } = useMutationCallbacks({
    withModal: true,
    reload: true,
  });

  const validationSchema = useValidationSchema({
    schema: createCategorySchema,
  });

  const [createCategoryMutation] = useCreateCategoryMutation({
    onCompleted: (data) => onCompleteCallback(data.createCategory),
    onError: onErrorCallback,
  });

  return (
    <ModalFrame testId={'create-category-modal'}>
      <ModalTitle>Создание категории</ModalTitle>

      <Formik<CreateCategoryInput>
        validationSchema={validationSchema}
        initialValues={{
          rubricId,
          nameI18n: {},
          replaceParentNameInCatalogueTitle: false,
          variants: GENDER_ENUMS.reduce((acc: OptionVariantsModel, gender) => {
            acc[gender] = {};
            return acc;
          }, {}),
        }}
        onSubmit={(values) => {
          showLoading();
          return createCategoryMutation({
            variables: {
              input: {
                ...values,
                parentId,
                rubricId,
              },
            },
          });
        }}
      >
        {() => {
          return (
            <Form>
              <CategoryMainFields />

              <ModalButtons>
                <WpButton type={'submit'} testId={'category-submit'}>
                  Создать
                </WpButton>
                <WpButton theme={'secondary'} onClick={hideModal}>
                  Закрыть
                </WpButton>
              </ModalButtons>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default CreateCategoryModal;
