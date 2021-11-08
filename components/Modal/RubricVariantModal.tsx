import { DEFAULT_COMPANY_SLUG } from 'config/common';
import * as React from 'react';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import ModalButtons from 'components/Modal/ModalButtons';
import { Form, Formik } from 'formik';
import Button from 'components/button/Button';
import { useAppContext } from 'context/appContext';
import { CreateRubricVariantInput, UpdateRubricVariantInput } from 'generated/apolloComponents';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import useValidationSchema from 'hooks/useValidationSchema';
import { TranslationModel } from 'db/dbModels';
import { rubricVariantInModalSchema } from 'validation/rubricVariantSchema';

export interface RubricVariantModalInterface {
  nameI18n?: TranslationModel;
  confirm: (values: CreateRubricVariantInput | Omit<UpdateRubricVariantInput, 'id'>) => void;
}

const RubricVariantModal: React.FC<RubricVariantModalInterface> = ({ nameI18n, confirm }) => {
  const validationSchema = useValidationSchema({
    schema: rubricVariantInModalSchema,
  });
  const { hideModal } = useAppContext();

  return (
    <ModalFrame testId={'rubric-variant-modal'}>
      <ModalTitle>{nameI18n ? 'Изменение названия' : 'Введите название'}</ModalTitle>

      <Formik
        initialValues={{
          nameI18n: nameI18n || {},
          companySlug: DEFAULT_COMPANY_SLUG,
        }}
        onSubmit={(values) => {
          confirm(values);
        }}
        validationSchema={validationSchema}
      >
        {() => {
          return (
            <Form>
              <FormikTranslationsInput
                label={'Введите название'}
                name={'nameI18n'}
                testId={'nameI18n'}
                showInlineError
              />

              <ModalButtons>
                <Button type={'submit'} testId={'rubric-variant-submit'}>
                  {nameI18n ? 'Изменить' : 'Создать'}
                </Button>

                <Button theme={'secondary'} onClick={hideModal} testId={'options-group-decline'}>
                  Отмена
                </Button>
              </ModalButtons>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default RubricVariantModal;
