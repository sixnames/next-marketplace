import { Form, Formik } from 'formik';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { signIn } from 'next-auth/react';
import * as React from 'react';
import WpButton from '../components/button/WpButton';
import { useAppContext } from '../components/context/appContext';
import FormikInput from '../components/FormElements/Input/FormikInput';
import Inner from '../components/Inner';
import SiteLayout, { SiteLayoutProviderInterface } from '../components/layout/SiteLayout';
import WpTitle from '../components/WpTitle';
import { getPageSessionUser } from '../db/dao/user/getPageSessionUser';
import useValidationSchema from '../hooks/useValidationSchema';
import { getSiteInitialData } from '../lib/ssrUtils';
import { signInSchema } from '../validation/userSchema';

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
          signIn<any>('credentials', {
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
            <Form className='mx-auto max-w-[20rem] py-12'>
              <WpTitle className='justify-center'>Авторизация</WpTitle>

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

              <WpButton
                // disabled={errors.email || errors.password}
                type={'submit'}
                testId={'sign-in-submit'}
              >
                Войти
              </WpButton>
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
    <SiteLayout title={'Авторизация'} {...props}>
      <SignInRoute />
    </SiteLayout>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<SignInPageInterface>> {
  const { props } = await getSiteInitialData({
    context,
  });

  // Session user
  const sessionUser = await getPageSessionUser({
    context,
    locale: props.sessionLocale,
  });

  // Redirect user to the Home page if already authorized
  if (sessionUser) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }

  return {
    props: {
      ...props,
      showForIndex: false,
    },
  };
}

export default SignIn;
