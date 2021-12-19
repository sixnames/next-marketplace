import * as React from 'react';
import { Form, Formik } from 'formik';
import { useAppContext } from '../../context/appContext';
import { useSiteUserContext } from '../../context/siteUserContext';
import { UpdateMyPasswordInputInterface } from '../../db/dao/user/updateMyPassword';
import useValidationSchema from '../../hooks/useValidationSchema';
import { updateMyPasswordSchema } from '../../validation/userSchema';
import WpButton from '../button/WpButton';
import FormikInput from '../FormElements/Input/FormikInput';
import RequestError from '../RequestError';
import ModalButtons from './ModalButtons';
import ModalFrame from './ModalFrame';
import ModalText from './ModalText';
import ModalTitle from './ModalTitle';

export interface UpdateMyPasswordModalInterface {
  confirm: (input: UpdateMyPasswordInputInterface) => void;
}

const UpdateMyPasswordModal: React.FC<UpdateMyPasswordModalInterface> = ({ confirm }) => {
  const sessionUser = useSiteUserContext();
  const { hideModal } = useAppContext();
  const validationSchema = useValidationSchema({
    schema: updateMyPasswordSchema,
  });

  if (!sessionUser?.me) {
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
                <WpButton type={'submit'} testId={'password-submit'}>
                  Изменить
                </WpButton>

                <WpButton theme={'secondary'} onClick={hideModal} testId={'password-decline'}>
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

export default UpdateMyPasswordModal;
