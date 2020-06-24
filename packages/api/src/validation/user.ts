import * as Yup from 'yup';
import { email, lastName, name, role, phone, secondName, id } from './templates';

export const updateUserSchema = Yup.object().shape({
  id,
  email,
  name,
  lastName,
  secondName,
  phone,
  role,
});

export const createUserSchema = Yup.object().shape({
  email,
  name,
  lastName,
  secondName,
  phone,
  role,
});
