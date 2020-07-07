import * as Yup from 'yup';
import { id, langInput, notNullableName } from './templates';

const parent = Yup.string().nullable();
const variant = Yup.string()
  .nullable()
  .when('parent', {
    is: (val) => val,
    then: Yup.string().nullable(),
    otherwise: Yup.string().required('Типа рубрики обязателен к заполнению.'),
  });

const attributesGroupId = Yup.string()
  .nullable()
  .required('ID группы атрибутов обязательно к заполнению.');

export const createRubricInputSchema = Yup.object().shape({
  name: langInput(notNullableName('Название рубрики')),
  catalogueName: langInput(notNullableName('Название каталога')),
  parent,
  variant,
});

export const updateRubricInputSchema = Yup.object().shape({
  id,
  name: langInput(notNullableName('Название рубрики')),
  catalogueName: langInput(notNullableName('Название каталога')),
  parent,
  variant,
});

export const addAttributesGroupToRubricClientSchema = Yup.object().shape({
  attributesGroupId,
});
