import * as Yup from 'yup';
import { id } from './templates';

const languageKeyLength = 2;

export const createLanguageSchema = Yup.object().shape({
  name: Yup.string().required('Название языка обязательно к заполнению'),
  key: Yup.string()
    .min(languageKeyLength)
    .max(languageKeyLength)
    .required('Ключ языка обязателен к заполнению'),
});

export const updateLanguageSchema = Yup.object().shape({
  id,
  name: Yup.string().required('Название языка обязательно к заполнению'),
  key: Yup.string()
    .min(languageKeyLength)
    .max(languageKeyLength)
    .required('Ключ языка обязателен к заполнению'),
});
