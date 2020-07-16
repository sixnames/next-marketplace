import * as Yup from 'yup';
import { id, langInput, notNullableName } from './templates';
import { GENDER_ENUMS } from '../config';

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

const rubricCatalogueTitleSchema = Yup.object().shape({
  defaultTitle: langInput(notNullableName('Название каталога')),
  prefix: langInput(Yup.string()),
  keyword: langInput(notNullableName('Ключевое слово каталога')),
  gender: Yup.mixed().oneOf(GENDER_ENUMS).required('Род рубрики обязателен к заполнению.'),
});

export const createRubricInputSchema = Yup.object().shape({
  name: langInput(notNullableName('Название рубрики')),
  catalogueTitle: rubricCatalogueTitleSchema,
  parent,
  variant,
});

export const updateRubricInputSchema = Yup.object().shape({
  id,
  name: langInput(notNullableName('Название рубрики')),
  catalogueTitle: rubricCatalogueTitleSchema,
  parent,
  variant,
});

export const addAttributesGroupToRubricSchema = Yup.object().shape({
  attributesGroupId,
});
