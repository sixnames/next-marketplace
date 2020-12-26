import React from 'react';
import { useUserContext } from '../../context/userContext';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import {
  useUpdateMyPasswordMutation,
  useUpdateMyProfileMutation,
} from '../../generated/apolloComponents';
import useValidationSchema from '../../hooks/useValidationSchema';
import { updateMyProfileSchema } from '@yagu/shared';
import { UpdateMyPasswordModalInterface } from '../../components/Modal/UpdateMyPasswordModal/UpdateMyPasswordModal';
import { UPDATE_MY_PASSWORD_MODAL } from '../../config/modals';
import RequestError from '../../components/RequestError/RequestError';
import { Form, Formik } from 'formik';
import FormikInput from '../../components/FormElements/Input/FormikInput';
import classes from './ProfileDetailsRoute.module.css';
import Button from '../../components/Buttons/Button';
import Title from '../../components/Title/Title';
import RowWithGap from '../../layout/RowWithGap/RowWithGap';
import StringButton from '../../components/Buttons/StringButton';

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
    <div className={classes.profile} data-cy={'profile-details'}>
      <div className={classes.form}>
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
                <fieldset className={classes.group}>
                  <Title tag={'legend'} size={'small'}>
                    Персональные данные
                  </Title>

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
                </fieldset>

                <fieldset className={classes.group}>
                  <Title tag={'legend'} size={'small'}>
                    Контактные данные
                  </Title>

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
                </fieldset>

                <RowWithGap>
                  <Button type={'submit'} testId={'submit-my-profile'}>
                    Сохранить
                  </Button>
                </RowWithGap>

                <RowWithGap>
                  <StringButton testId={'update-my-password'} onClick={updateMyPasswordHandler}>
                    Изменить пароль
                  </StringButton>
                </RowWithGap>
              </Form>
            );
          }}
        </Formik>
      </div>

      <div className={classes.card}>User card with avatar</div>
    </div>
  );
};

export default ProfileDetailsRoute;
