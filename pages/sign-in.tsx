import Button from 'components/Button';
import FormikInput from 'components/FormElements/Input/FormikInput';
import Inner from 'components/Inner';
import Title from 'components/Title';
import { useAppContext } from 'context/appContext';
import useValidationSchema from 'hooks/useValidationSchema';
import SiteLayoutProvider, { SiteLayoutProviderInterface } from 'layout/SiteLayoutProvider';
import { getSiteInitialData } from 'lib/ssrUtils';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { signIn } from 'next-auth/client';
import { signInSchema } from 'validation/userSchema';
import { Form, Formik } from 'formik';

const SignInRoute: React.FC = () => {
  const { showLoading, hideLoading } = useAppContext();
  const [isError, setIsError] = React.useState<boolean>(false);
  const validationSchema = useValidationSchema({
    schema: signInSchema,
  });

  return (
    <Inner>
      <Formik
        validationSchema={validationSchema}
        initialValues={{
          email: '',
          password: '',
        }}
        onSubmit={(values) => {
          showLoading();
          signIn('credentials', {
            redirect: false,
            ...values,
          })
            .then((res) => {
              hideLoading();

              if (!res) {
                setIsError(true);
                return;
              }

              if (res.ok) {
                setIsError(false);
                window.location.pathname = '/';
                return;
              }

              setIsError(true);
            })
            .catch(() => {
              hideLoading();
              setIsError(true);
            });
        }}
      >
        {() => {
          return (
            <Form className='max-w-[20rem] py-12 mx-auto'>
              <Title className='justify-center'>Авторизация</Title>

              <FormikInput
                label={'Ваш Email'}
                name={'email'}
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
                // disabled={errors.email || errors.password}
                type={'submit'}
                testId={'sign-in-submit'}
              >
                Войти
              </Button>
              {isError ? (
                <div className='mt-6 font-medium text-red-500'>
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

export type SignInPageInterface = SiteLayoutProviderInterface;

const SignIn: NextPage<SignInPageInterface> = (props) => {
  return (
    <SiteLayoutProvider title={'Авторизация'} {...props}>
      <SignInRoute />
    </SiteLayoutProvider>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<SignInPageInterface>> {
  const { props } = await getSiteInitialData({
    context,
  });

  // Redirect user to the Home page if already authorized
  if (props.sessionUser) {
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
