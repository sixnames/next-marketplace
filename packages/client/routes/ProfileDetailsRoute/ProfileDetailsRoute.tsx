import React from 'react';
import { useUserContext } from '../../context/userContext';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import {
  useUpdateMyPasswordMutation,
  useUpdateMyProfileMutation,
} from '../../generated/apolloComponents';
import useValidationSchema from '../../hooks/useValidationSchema';
import { updateMyProfileSchema } from '@yagu/validation';
import { UpdateMyPasswordModalInterface } from '../../components/Modal/UpdateMyPasswordModal/UpdateMyPasswordModal';
import { UPDATE_MY_PASSWORD_MODAL } from '../../config/modals';
import RequestError from '../../components/RequestError/RequestError';
import { Form, Formik } from 'formik';
import FormikInput from '../../components/FormElements/Input/FormikInput';
// import classes from './ProfileDetailsRoute.module.css';
import Button from '../../components/Buttons/Button';

const ProfileDetailsRoute: React.FC = () => {
  const { me, updateMyContext } = useUserContext();
  const { onErrorCallback, onCompleteCallback, showModal, showLoading } = useMutationCallbacks({
    withModal: true,
  });
  const [updateMyProfileMutation] = useUpdateMyProfileMutation({
    onError: onErrorCallback,
    onCompleted: (data) => {
      onCompleteCallback(data.updateMyProfile);
      updateMyContext(data.updateMyProfile.user);
    },
  });
  const validationSchema = useValidationSchema({
    schema: updateMyProfileSchema,
  });
  const [updateMyPasswordMutation] = useUpdateMyPasswordMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.updateMyPassword),
  });

  function updateMyPasswordHandler() {
    showModal<UpdateMyPasswordModalInterface>({
      variant: UPDATE_MY_PASSWORD_MODAL,
      props: {
        confirm: async (input) => {
          showLoading();
          await updateMyPasswordMutation({
            variables: {
              input,
            },
          });
        },
      },
    });
  }

  if (!me) {
    return <RequestError message={'Пользователь не найден'} />;
  }

  const { id, email, phone, name, lastName, secondName } = me;

  return (
    <div data-cy={'profile-details'}>
      <div>
        <Formik
          initialValues={{
            id,
            name,
            lastName,
            secondName,
            email,
            phone,
          }}
          onSubmit={async (values) => {
            await updateMyProfileMutation({
              variables: {
                input: values,
              },
            });
          }}
          validationSchema={validationSchema}
        >
          {() => {
            return (
              <Form>
                <FormikInput
                  label={'Имя'}
                  name={'name'}
                  testId={'name'}
                  isRequired
                  showInlineError
                />
                <FormikInput
                  label={'Фамилия'}
                  name={'lastName'}
                  testId={'lastName'}
                  showInlineError
                />
                <FormikInput
                  label={'Отчество'}
                  name={'secondName'}
                  testId={'secondName'}
                  showInlineError
                />
                <FormikInput
                  label={'Email'}
                  type={'email'}
                  name={'email'}
                  testId={'email'}
                  isRequired
                  showInlineError
                />
                <FormikInput
                  label={'Телефон'}
                  type={'tel'}
                  name={'phone'}
                  testId={'phone'}
                  isRequired
                  showInlineError
                />
                <div>
                  <Button type={'submit'} testId={'submit-my-profile'}>
                    Сохранить
                  </Button>
                </div>
                <div>
                  <Button
                    theme={'secondary'}
                    testId={'update-my-password'}
                    onClick={updateMyPasswordHandler}
                  >
                    Изменить пароль
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
      <div>Card</div>
    </div>
  );
};

export default ProfileDetailsRoute;
