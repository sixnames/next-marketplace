import React from 'react';
import ModalFrame from '../ModalFrame';
import ModalTitle from '../ModalTitle';
import ModalButtons from '../ModalButtons';
import { Form, Formik } from 'formik';
import Button from '../../Buttons/Button';
import { useAppContext } from '../../../context/appContext';
import {
  CreateOptionsGroupInput,
  LanguageType,
  UpdateOptionsGroupInput,
} from '../../../generated/apolloComponents';
import { useLanguageContext } from '../../../context/languageContext';
import FormikTranslationsInput from '../../FormElements/Input/FormikTranslationsInput';
import { optionsGroupModalSchema } from '../../../validation';

export interface OptionsGroupModalInterface {
  name?: LanguageType[];
  confirm: (values: CreateOptionsGroupInput | Omit<UpdateOptionsGroupInput, 'id'>) => void;
}

const OptionsGroupModal: React.FC<OptionsGroupModalInterface> = ({ name, confirm }) => {
  const {
    getLanguageFieldInitialValue,
    getLanguageFieldInputValue,
    defaultLang,
  } = useLanguageContext();
  const { hideModal } = useAppContext();

  return (
    <ModalFrame testId={'options-group-modal'}>
      <ModalTitle>{name ? 'Изменение названия группы' : 'Введите название группы'}</ModalTitle>

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
                isRequired
              />

              <ModalButtons>
                <Button type={'submit'} testId={'options-group-submit'}>
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

export default OptionsGroupModal;
