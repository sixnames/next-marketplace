import React from 'react';
import ModalFrame from '../ModalFrame';
import ModalTitle from '../ModalTitle';
import ModalButtons from '../ModalButtons';
import { Form, Formik } from 'formik';
import Button from '../../Buttons/Button';
import { useAppContext } from '../../../context/appContext';
import {
  CreateAttributesGroupInput,
  LanguageType,
  UpdateAttributesGroupInput,
} from '../../../generated/apolloComponents';
import { useLanguageContext } from '../../../context/languageContext';
import FormikTranslationsInput from '../../FormElements/Input/FormikTranslationsInput';
import { attributesGroupModalSchema } from '../../../validation';

export interface AttributesGroupModalInterface {
  name?: LanguageType[];
  confirm: (values: CreateAttributesGroupInput | Omit<UpdateAttributesGroupInput, 'id'>) => void;
}

const AttributesGroupModal: React.FC<AttributesGroupModalInterface> = ({ name, confirm }) => {
  const {
    getLanguageFieldInitialValue,
    getLanguageFieldInputValue,
    defaultLang,
  } = useLanguageContext();
  const { hideModal } = useAppContext();

  return (
    <ModalFrame testId={'attributes-group-modal'}>
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
        validationSchema={attributesGroupModalSchema(defaultLang)}
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
                <Button type={'submit'} testId={'attributes-group-submit'}>
                  {name ? 'Изменить' : 'Создать'}
                </Button>

                <Button theme={'secondary'} onClick={hideModal} testId={'attributes-group-decline'}>
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

export default AttributesGroupModal;
