import * as Yup from 'yup';

const languageKeyLength = 2;

export const languageSchema = Yup.object().shape({
  name: Yup.string().required('Название языка обязательно к заполнению'),
  key: Yup.string()
    .min(languageKeyLength)
    .max(languageKeyLength)
    .required('Ключ языка обязателен к заполнению'),
});
