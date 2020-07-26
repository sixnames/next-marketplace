import React, { useEffect } from 'react';
import { useUserContext } from '../../context/userContext';
import { SignInInput } from '../../generated/apolloComponents';
import Router from 'next/router';
import { Form, Formik } from 'formik';
import Title from '../../components/Title/Title';
import FormikInput from '../../components/FormElements/Input/FormikInput';
import Button from '../../components/Buttons/Button';
import Inner from '../../components/Inner/Inner';
import classes from './SignInRoute.module.css';
import useSignIn from '../../hooks/useSignIn';
import { signInValidationSchema } from '../../validation';
import useValidationSchema from '../../hooks/useValidationSchema';

const SignInRoute: React.FC = () => {
  const { me } = useUserContext();
  const { signInHandler } = useSignIn();
  const validationSchema = useValidationSchema({
    schema: signInValidationSchema,
    messagesKeys: [
      'validation.email',
      'validation.email.required',
      'validation.users.password',
      'validation.string.min',
      'validation.string.max',
    ],
  });

  const initialValues: SignInInput = {
    email: '',
    password: '',
  };

  useEffect(() => {
    if (me) {
      Router.replace('/');
    }
  }, [me]);

  return (
    <Formik
      validateOnBlur={false}
      validateOnChange={false}
      validationSchema={validationSchema}
      onSubmit={signInHandler}
      initialValues={initialValues}
    >
      {() => (
        <Inner>
          <Form className={classes.form}>
            <Title className={classes.title}>Авторизация</Title>

            <FormikInput
              label={'Ваш Email'}
              name={'email'}
              type={'email'}
              testId={'sign-in-email'}
              showInlineError
            />

            <FormikInput
              label={'Ваш пароль'}
              name={'password'}
              type={'password'}
              testId={'sign-in-password'}
              showInlineError
            />

            <Button type={'submit'} testId={'sign-in-submit'}>
              Войти
            </Button>
          </Form>
        </Inner>
      )}
    </Formik>
  );
};

export default SignInRoute;
