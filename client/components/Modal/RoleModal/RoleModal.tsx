import React from 'react';
import ModalFrame from '../ModalFrame';
import ModalTitle from '../ModalTitle';
import ModalButtons from '../ModalButtons';
import { Form, Formik } from 'formik';
import Button from '../../Buttons/Button';
import { useAppContext } from '../../../context/appContext';
import { CreateRoleInput, Role, UpdateRoleInput } from '../../../generated/apolloComponents';
import { useLanguageContext } from '../../../context/languageContext';
import FormikTranslationsInput from '../../FormElements/Input/FormikTranslationsInput';
import useValidationSchema from '../../../hooks/useValidationSchema';
import { createRoleSchema } from '../../../validation/roleSchema';
import FormikTextarea from '../../FormElements/Textarea/FormikTextarea';
import FormikCheckboxLine from '../../FormElements/Checkbox/FormikCheckboxLine';

export interface RoleModalInterface {
  role?: Pick<Role, 'name' | 'description' | 'isStuff'>;
  confirm: (values: CreateRoleInput | Omit<UpdateRoleInput, 'id'>) => void;
}

const RoleModal: React.FC<RoleModalInterface> = ({ role = {}, confirm }) => {
  const { getLanguageFieldInitialValue, getLanguageFieldInputValue } = useLanguageContext();
  const { hideModal } = useAppContext();
  const validationSchema = useValidationSchema({
    schema: createRoleSchema,
    messagesKeys: ['validation.roles.name', 'validation.roles.description'],
  });

  const { name, description = '', isStuff = false } = role;

  return (
    <ModalFrame testId={'options-group-modal'}>
      <ModalTitle>{name ? 'Изменение роли' : 'Создание роли'}</ModalTitle>

      <Formik
        initialValues={{
          name: getLanguageFieldInitialValue(name),
          description,
          isStuff,
        }}
        onSubmit={({ name, description, isStuff }) => {
          confirm({
            name: getLanguageFieldInputValue(name),
            description,
            isStuff,
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

              <FormikTextarea name={'description'} label={'Описание'} isRequired showInlineError />

              <FormikCheckboxLine label={'Является персоналом'} name={'isStuff'} />

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

export default RoleModal;
