import React from 'react';
import useSignIn from '../../hooks/mutations/useSignIn';
import { Form, Formik } from 'formik';
import { SignInInput } from '../../generated/apolloComponents';
import { signInValidationSchema } from '@rg/validation';
import Inner from '../../components/Inner/Inner';
import FormikInput from '../../components/FormElements/Input/FormikInput';
import Button from '../../components/Buttons/Button';
import Title from '../../components/Title/Title';
import classes from './SignIn.module.css';

const SignIn: React.FC = () => {
  const { signInHandler } = useSignIn();

  const initialValues: SignInInput = {
    email: '',
    password: '',
  };

  return (
    <Inner>
      <div className={classes.frame}>
        <Formik
          validateOnBlur={false}
          validateOnChange={false}
          validationSchema={signInValidationSchema}
          onSubmit={signInHandler}
          initialValues={initialValues}
        >
          {() => (
            <Form className={classes.form}>
              <Title>Авторизация</Title>

              <FormikInput
                label={'Ваш номер телефона'}
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
          )}
        </Formik>
      </div>
    </Inner>
  );
};

export default SignIn;
