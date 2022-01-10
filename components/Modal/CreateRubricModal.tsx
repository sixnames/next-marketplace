import * as React from 'react';
import { Form, Formik } from 'formik';
import { useAppContext } from '../../context/appContext';
import { CreateRubricInput, Gender } from '../../generated/apolloComponents';
import useValidationSchema from '../../hooks/useValidationSchema';
import { createRubricSchema } from '../../validation/rubricSchema';
import WpButton from '../button/WpButton';
import RubricMainFields, { RubricMainFieldsInterface } from '../FormTemplates/RubricMainFields';
import ModalButtons from './ModalButtons';
import ModalFrame from './ModalFrame';
import ModalTitle from './ModalTitle';

export interface CreateRubricModalInterface extends RubricMainFieldsInterface {
  confirm: (values: CreateRubricInput) => void;
}

const CreateRubricModal: React.FC<CreateRubricModalInterface> = ({ confirm, rubricVariants }) => {
  const { hideModal } = useAppContext();
  const validationSchema = useValidationSchema({
    schema: createRubricSchema,
  });

  return (
    <ModalFrame testId={'create-rubric-modal'}>
      <ModalTitle>Создание рубрики</ModalTitle>

      <Formik<CreateRubricInput>
        validationSchema={validationSchema}
        initialValues={{
          nameI18n: {},
          descriptionI18n: {},
          shortDescriptionI18n: {},
          variantId: rubricVariants[0]?._id || null,
          capitalise: false,
          showRubricNameInProductTitle: false,
          showCategoryInProductTitle: false,
          showBrandInNav: false,
          showBrandInFilter: false,
          showBrandAsAlphabet: false,
          defaultTitleI18n: {},
          prefixI18n: {},
          keywordI18n: {},
          gender: '' as Gender,
        }}
        onSubmit={(values) => {
          confirm(values);
        }}
      >
        {() => {
          return (
            <Form>
              <RubricMainFields rubricVariants={rubricVariants} />

              <ModalButtons>
                <WpButton type={'submit'} testId={'rubric-submit'}>
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

export default CreateRubricModal;
