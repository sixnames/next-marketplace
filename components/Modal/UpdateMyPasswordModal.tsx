import ModalText from 'components/Modal/ModalText';
import { UpdateMyPasswordInputInterface } from 'db/dao/user/updateMyPassword';
import * as React from 'react';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import ModalButtons from 'components/Modal/ModalButtons';
import { Form, Formik } from 'formik';
import Button from 'components/Button';
import { useAppContext } from 'context/appContext';
import useValidationSchema from 'hooks/useValidationSchema';
import { useUserContext } from 'context/userContext';
import RequestError from 'components/RequestError';
import FormikInput from 'components/FormElements/Input/FormikInput';
import { updateMyPasswordSchema } from 'validation/userSchema';

export interface UpdateMyPasswordModalInterface {
  confirm: (input: UpdateMyPasswordInputInterface) => void;
}

const UpdateMyPasswordModal: React.FC<UpdateMyPasswordModalInterface> = ({ confirm }) => {
  const { me } = useUserContext();
  const { hideModal } = useAppContext();
  const validationSchema = useValidationSchema({
    schema: updateMyPasswordSchema,
  });

  if (!me) {
    return (
      <ModalFrame>
        <RequestError message={'Пользователь не найден'} />
      </ModalFrame>
    );
  }

  return (
    <ModalFrame testId={'password-modal'}>
      <ModalTitle>Изменение пароля</ModalTitle>
      <ModalText>При изменении пароля требуется повторная авторизация.</ModalText>

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
