import * as Yup from 'yup';
import { email, lastName, password, name, secondName, phone } from './templates';

export const signInValidationSchema = Yup.object().shape({
  email,
  password,
});

export const signUpValidationSchema = Yup.object().shape({
  email,
  name,
  lastName,
  secondName,
  phone,
  password,
});
