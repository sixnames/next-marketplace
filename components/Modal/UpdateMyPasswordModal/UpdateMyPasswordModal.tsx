import * as React from 'react';
import ModalFrame from '../ModalFrame';
import ModalTitle from '../ModalTitle';
import ModalButtons from '../ModalButtons';
import { Form, Formik } from 'formik';
import Button from '../../Buttons/Button';
import { useAppContext } from 'context/appContext';
import { UpdateMyPasswordInput } from 'generated/apolloComponents';
import useValidationSchema from '../../../hooks/useValidationSchema';
import { useUserContext } from 'context/userContext';
import RequestError from '../../RequestError/RequestError';
import FormikInput from '../../FormElements/Input/FormikInput';
import { updateMyPasswordSchema } from 'validation/userSchema';

export interface UpdateMyPasswordModalInterface {
  confirm: (input: UpdateMyPasswordInput) => void;
}

const UpdateMyPasswordModal: React.FC<UpdateMyPasswordModalInterface> = ({ confirm }) => {
  const { state } = useUserContext();
  const { hideModal } = useAppContext();
  const validationSchema = useValidationSchema({
    schema: updateMyPasswordSchema,
  });

  if (!state.me) {
    return (
      <ModalFrame>
        <RequestError message={'Пользователь не найден'} />
      </ModalFrame>
    );
  }

  return (
    <ModalFrame testId={'password-modal'}>
      <ModalTitle>Изменение пароля</ModalTitle>

      <Formik
        initialValues={{
          oldPassword: '',
          newPassword: '',
          newPasswordB: '',
        }}
        onSubmit={({ oldPassword, newPassword, newPasswordB }) => {
          confirm({
            oldPassword,
            newPassword,
            newPasswordB,
          });
        }}
        validationSchema={validationSchema}
      >
        {() => {
          return (
            <Form>
              <FormikInput
                label={'Старый пароль'}
                name={'oldPassword'}
                testId={'oldPassword'}
                type={'password'}
                isRequired
                showInlineError
              />

              <FormikInput
                label={'Новый пароль'}
                name={'newPassword'}
                testId={'newPassword'}
                type={'password'}
                isRequired
                showInlineError
              />

              <FormikInput
                label={'Повторите новый пароль'}
                name={'newPasswordB'}
                testId={'newPasswordB'}
                type={'password'}
                isRequired
                showInlineError
              />

              <ModalButtons>
                <Button type={'submit'} testId={'password-submit'}>
                  Изменить
                </Button>

                <Button theme={'secondary'} onClick={hideModal} testId={'password-decline'}>
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

export default UpdateMyPasswordModal;
