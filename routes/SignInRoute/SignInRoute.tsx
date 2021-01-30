import Input, { InputEvent } from 'components/FormElements/Input/Input';
import * as React from 'react';
import Title from 'components/Title/Title';
import Button from 'components/Buttons/Button';
import Inner from 'components/Inner/Inner';
import classes from './SignInRoute.module.css';
import useValidationSchema from 'hooks/useValidationSchema';
import { signInSchema } from 'validation/userSchema';
//
interface SignInRouteInterface {
  token: string;
}

interface SignInInputs {
  username: string;
  password: string;
}

interface SignInErrors {
  username: boolean;
  password: boolean;
}

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
        <input name='csrfToken' type='hidden' defaultValue={token} />

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

export default SignInRoute;
