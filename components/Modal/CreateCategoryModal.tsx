import CategoryMainFields from 'components/FormTemplates/CategoryMainFields';
import { GENDER_ENUMS } from 'config/common';
import { OptionVariantsModel } from 'db/dbModels';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import * as React from 'react';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import ModalButtons from 'components/Modal/ModalButtons';
import { Form, Formik } from 'formik';
import Button from 'components/Button';
import { CreateCategoryInput, useCreateCategoryMutation } from 'generated/apolloComponents';
import useValidationSchema from 'hooks/useValidationSchema';
import { createCategorySchema } from 'validation/categorySchema';

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
          useChildNameInCatalogueTitle: false,
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
                <Button type={'submit'} testId={'category-submit'}>
                  Создать
                </Button>
                <Button theme={'secondary'} onClick={hideModal}>
                  Закрыть
                </Button>
              </ModalButtons>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default CreateCategoryModal;
