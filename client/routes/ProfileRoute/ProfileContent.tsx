import React from 'react';
import DataLayoutContentFrame from '../../components/DataLayout/DataLayoutContentFrame';
import Inner from '../../components/Inner/Inner';
import { useUserContext } from '../../context/userContext';
import { Form, Formik } from 'formik';
import FormikInput from '../../components/FormElements/Input/FormikInput';
import {
  useUpdateMyPasswordMutation,
  useUpdateMyProfileMutation,
} from '../../generated/apolloComponents';
import RequestError from '../../components/RequestError/RequestError';
import Button from '../../components/Buttons/Button';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import useValidationSchema from '../../hooks/useValidationSchema';
import { updateMyProfileSchema } from '../../validation';
import classes from './ProfileContent.module.css';
import { UpdateMyPasswordModalInterface } from '../../components/Modal/UpdateMyPasswordModal/UpdateMyPasswordModal';
import { UPDATE_MY_PASSWORD_MODAL } from '../../config/modals';

const ProfileContent: React.FC = () => {
  const { me, updateMyContext } = useUserContext();
  const { onErrorCallback, onCompleteCallback, showModal } = useMutationCallbacks({});
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
      type: UPDATE_MY_PASSWORD_MODAL,
      props: {
        confirm: async (input) => {
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
    <DataLayoutContentFrame>
      <Inner>
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
                  isRequired
                  showInlineError
                />
                <FormikInput
                  label={'Отчество'}
                  name={'secondName'}
                  testId={'secondName'}
                  isRequired
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
                <div className={classes.butnLine}>
                  <Button type={'submit'} testId={'submit-my-profile'}>
                    Сохранить
                  </Button>
                </div>
                <div className={classes.butnLine}>
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
      </Inner>
    </DataLayoutContentFrame>
  );
};

export default ProfileContent;
