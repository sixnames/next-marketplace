import * as React from 'react';
import { Form, Formik } from 'formik';
import { DEFAULT_COMPANY_SLUG } from '../../config/common';
import { useAppContext } from '../../context/appContext';
import { TranslationModel } from '../../db/dbModels';
import {
  CreateRubricVariantInput,
  UpdateRubricVariantInput,
} from '../../generated/apolloComponents';
import useValidationSchema from '../../hooks/useValidationSchema';
import { rubricVariantInModalSchema } from '../../validation/rubricVariantSchema';
import WpButton from '../button/WpButton';
import FormikTranslationsInput from '../FormElements/Input/FormikTranslationsInput';
import ModalButtons from './ModalButtons';
import ModalFrame from './ModalFrame';
import ModalTitle from './ModalTitle';

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
                <WpButton type={'submit'} testId={'rubric-variant-submit'}>
                  {nameI18n ? 'Изменить' : 'Создать'}
                </WpButton>

                <WpButton theme={'secondary'} onClick={hideModal} testId={'options-group-decline'}>
                  Отмена
                </WpButton>
              </ModalButtons>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default RubricVariantModal;
