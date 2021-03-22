import Button from 'components/Buttons/Button';
import FormikInput from 'components/FormElements/Input/FormikInput';
import Inner from 'components/Inner/Inner';
import Title from 'components/Title/Title';
import useValidationSchema from 'hooks/useValidationSchema';
import { getSiteInitialData } from 'lib/ssrUtils';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import SiteLayout, { SiteLayoutInterface } from 'layout/SiteLayout/SiteLayout';
import { getSession, signIn } from 'next-auth/client';
import classes from 'routes/SignInRoute/SignInRoute.module.css';
import { signInSchema } from 'validation/userSchema';
import { Form, Formik } from 'formik';

const SignInRoute: React.FC = () => {
  const [isError, setIsError] = React.useState<boolean>(false);
  const validationSchema = useValidationSchema({
    schema: signInSchema,
  });

  return (
    <Inner>
      <Formik
        validationSchema={validationSchema}
        initialValues={{
          username: '',
          password: '',
        }}
        onSubmit={(values) => {
          signIn('credentials', {
            redirect: false,
            ...values,
          })
            .then(({ ok }) => {
              if (ok) {
                setIsError(false);
                window.location.pathname = '/';
              }

              setIsError(true);
            })
            .catch(() => {
              setIsError(true);
            });
        }}
      >
        {() => {
          return (
            <Form className={classes.form}>
              <Title className={classes.title}>Авторизация</Title>

              <FormikInput
                label={'Ваш Email'}
                name={'username'}
                type={'email'}
                testId={'sign-in-email'}
              />

              <FormikInput
                label={'Ваш пароль'}
                name={'password'}
                type={'password'}
                testId={'sign-in-password'}
              />

              <Button
                // disabled={errors.username || errors.password}
                type={'submit'}
                testId={'sign-in-submit'}
              >
                Войти
              </Button>
              {isError ? (
                <div className={classes.error}>
                  Пожалуйста проверьте правильность введённых данных
                </div>
              ) : null}
            </Form>
          );
        }}
      </Formik>
    </Inner>
  );
};

export interface SignInPageInterface extends PagePropsInterface, SiteLayoutInterface {}

const SignIn: NextPage<SignInPageInterface> = ({ navRubrics }) => {
  return (
    <SiteLayout title={'Авторизация'} navRubrics={navRubrics}>
      <SignInRoute />
    </SiteLayout>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<SignInPageInterface>> {
  const session = await getSession(context);

  const { props } = await getSiteInitialData({
    context,
  });

  // Redirect user to the Home page if already authorized
  if (session?.user) {
    return {
      redirect: {
        permanent: false,
        destination: `/`,
      },
    };
  }

  return {
    props,
  };
}

export default SignIn;
