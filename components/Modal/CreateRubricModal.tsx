import { GENDER_IT } from 'config/common';
import { CreateRubricInputInterface } from 'db/dao/rubrics/createRubric';
import { useCreateRubric } from 'hooks/mutations/useRubricMutations';
import * as React from 'react';
import { Form, Formik } from 'formik';
import { useAppContext } from 'context/appContext';
import useValidationSchema from '../../hooks/useValidationSchema';
import { createRubricSchema } from 'validation/rubricSchema';
import WpButton from '../button/WpButton';
import RubricMainFields, { RubricMainFieldsInterface } from '../FormTemplates/RubricMainFields';
import ModalButtons from './ModalButtons';
import ModalFrame from './ModalFrame';
import ModalTitle from './ModalTitle';

export interface CreateRubricModalInterface extends RubricMainFieldsInterface {}

const CreateRubricModal: React.FC<CreateRubricModalInterface> = ({ rubricVariants }) => {
  const { hideModal } = useAppContext();
  const validationSchema = useValidationSchema({
    schema: createRubricSchema,
  });
  const [createRubricMutation] = useCreateRubric();

  return (
    <ModalFrame testId={'create-rubric-modal'}>
      <ModalTitle>Создание рубрики</ModalTitle>

      <Formik<CreateRubricInputInterface>
        validationSchema={validationSchema}
        initialValues={{
          nameI18n: {},
          descriptionI18n: {},
          shortDescriptionI18n: {},
          variantId: rubricVariants[0] ? `${rubricVariants[0]?._id}` : '',
          capitalise: false,
          showRubricNameInProductTitle: false,
          showCategoryInProductTitle: false,
          showBrandInNav: false,
          showBrandInFilter: false,
          showBrandAsAlphabet: false,
          defaultTitleI18n: {},
          prefixI18n: {},
          keywordI18n: {},
          gender: GENDER_IT,
        }}
        onSubmit={(values) => {
          createRubricMutation(values).catch(console.log);
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
