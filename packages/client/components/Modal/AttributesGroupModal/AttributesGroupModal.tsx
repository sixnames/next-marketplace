import React from 'react';
import ModalFrame from '../ModalFrame';
import ModalTitle from '../ModalTitle';
import ModalButtons from '../ModalButtons';
import { Form, Formik } from 'formik';
import Button from '../../Buttons/Button';
import { useAppContext } from '../../../context/appContext';
import {
  CreateAttributesGroupInput,
  Translation,
  UpdateAttributesGroupInput,
} from '../../../generated/apolloComponents';
import { useLanguageContext } from '../../../context/languageContext';
import FormikTranslationsInput from '../../FormElements/Input/FormikTranslationsInput';
import useValidationSchema from '../../../hooks/useValidationSchema';
import { attributesGroupModalSchema } from '@yagu/shared';

export interface AttributesGroupModalInterface {
  name?: Translation[];
  confirm: (values: CreateAttributesGroupInput | Omit<UpdateAttributesGroupInput, 'id'>) => void;
}

const AttributesGroupModal: React.FC<AttributesGroupModalInterface> = ({ name, confirm }) => {
  const { getLanguageFieldInitialValue, getLanguageFieldInputValue } = useLanguageContext();
  const validationSchema = useValidationSchema({
    schema: attributesGroupModalSchema,
  });
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
        validationSchema={validationSchema}
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
