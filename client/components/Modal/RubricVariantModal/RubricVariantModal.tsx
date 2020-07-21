import React from 'react';
import ModalFrame from '../ModalFrame';
import ModalTitle from '../ModalTitle';
import ModalButtons from '../ModalButtons';
import { Form, Formik } from 'formik';
import Button from '../../Buttons/Button';
import { useAppContext } from '../../../context/appContext';
import {
  CreateRubricVariantInput,
  LanguageType,
  UpdateRubricVariantInput,
} from '../../../generated/apolloComponents';
import { useLanguageContext } from '../../../context/languageContext';
import FormikTranslationsInput from '../../FormElements/Input/FormikTranslationsInput';
import { optionsGroupModalSchema } from '../../../validation';

export interface RubricVariantModalInterface {
  name?: LanguageType[];
  confirm: (values: CreateRubricVariantInput | Omit<UpdateRubricVariantInput, 'id'>) => void;
}

const RubricVariantModal: React.FC<RubricVariantModalInterface> = ({ name, confirm }) => {
  const {
    getLanguageFieldInitialValue,
    getLanguageFieldInputValue,
    defaultLang,
  } = useLanguageContext();
  const { hideModal } = useAppContext();

  return (
    <ModalFrame testId={'rubric-variant-modal'}>
      <ModalTitle>{name ? 'Изменение названия' : 'Введите название'}</ModalTitle>

      <Formik
        initialValues={{
          name: getLanguageFieldInitialValue(name),
        }}
        onSubmit={({ name }) => {
          confirm({
            name: getLanguageFieldInputValue(name),
          });
        }}
        validationSchema={optionsGroupModalSchema(defaultLang)}
      >
        {() => {
          return (
            <Form>
              <FormikTranslationsInput
                label={'Введите название'}
                name={'name'}
                testId={'name'}
                showInlineError
              />

              <ModalButtons>
                <Button type={'submit'} testId={'rubric-variant-submit'}>
                  {name ? 'Изменить' : 'Создать'}
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
