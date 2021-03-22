import Button from 'components/Buttons/Button';
import Input, { InputEvent } from 'components/FormElements/Input/Input';
import Inner from 'components/Inner/Inner';
import Title from 'components/Title/Title';
import useValidationSchema from 'hooks/useValidationSchema';
import { getSiteInitialData } from 'lib/ssrUtils';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import SiteLayout, { SiteLayoutInterface } from 'layout/SiteLayout/SiteLayout';
import { csrfToken, getSession } from 'next-auth/client';
import classes from 'routes/SignInRoute/SignInRoute.module.css';
import { signInSchema } from 'validation/userSchema';

interface SignInInputs {
  username: string;
  password: string;
}

interface SignInErrors {
  username: boolean;
  password: boolean;
}

interface SignInRouteInterface {
  token: string | null;
}

// TODO refactor this page to Formik
const SignInRoute: React.FC<SignInRouteInterface> = ({ token }) => {
  const validationSchema = useValidationSchema({
    schema: signInSchema,
  });

  const [inputs, setInputs] = React.useState<SignInInputs>({
    username: '',
    password: '',
  });

  const [errors, setErrors] = React.useState<SignInErrors>({
    username: false,
    password: false,
  });

  // Validate inputs
  React.useEffect(() => {
    try {
      validationSchema.validateSync(inputs);
      setErrors({
        username: false,
        password: false,
      });
    } catch (e) {
      setErrors({
        username: e.path === 'username',
        password: e.path === 'password',
      });
    }
  }, [inputs, validationSchema]);

  function onChangeHandler(e: InputEvent) {
    setInputs((prevState) => {
      return {
        ...prevState,
        [`${e.target.name}`]: e.target.value,
      };
    });
  }

  return (
    <Inner>
      <form className={classes.form} method='post' action={'/api/auth/callback/credentials'}>
        <Title className={classes.title}>Авторизация</Title>
        <input name='csrfToken' type='hidden' defaultValue={`${token}`} />

        <Input
          onChange={onChangeHandler}
          value={inputs.username}
          label={'Ваш Email'}
          name={'username'}
          type={'email'}
          testId={'sign-in-email'}
          notValid={errors.username}
        />

        <Input
          onChange={onChangeHandler}
          value={inputs.password}
          label={'Ваш пароль'}
          name={'password'}
          type={'password'}
          testId={'sign-in-password'}
          notValid={errors.password}
        />

        <Button
          disabled={errors.username || errors.password}
          type={'submit'}
          testId={'sign-in-submit'}
        >
          Войти
        </Button>
      </form>
    </Inner>
  );
};

export interface SignInPageInterface extends PagePropsInterface, SiteLayoutInterface {
  token: string | null;
}

const SignIn: NextPage<SignInPageInterface> = ({ token, navRubrics }) => {
  return (
    <SiteLayout title={'Авторизация'} navRubrics={navRubrics}>
      <SignInRoute token={token} />
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

  // Get session token
  const token = await csrfToken(context);

  return {
    props: {
      token,
      ...props,
    },
  };
}

export default SignIn;
