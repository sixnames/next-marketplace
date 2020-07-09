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

const rubricId = Yup.string().nullable().required('ID рубрики обязательно к заполнению.');
const attributesGroupId = Yup.string()
  .nullable()
  .required('ID группы атрибутов обязательно к заполнению.');
const attributeId = Yup.string().nullable().required('ID атрибута обязательно к заполнению.');
const productId = Yup.string().nullable().required('ID товара обязательно к заполнению.');

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

export const addAttributesGroupToRubricInputSchema = Yup.object().shape({
  rubricId,
  attributesGroupId,
});

export const deleteAttributesGroupFromRubricInputSchema = Yup.object().shape({
  rubricId,
  attributesGroupId,
});

export const updateAttributesGroupInRubricInputSchema = Yup.object().shape({
  rubricId,
  attributesGroupId,
  attributeId,
});

export const addProductToRubricInputSchema = Yup.object().shape({
  rubricId,
  productId,
});

export const deleteProductFromRubricInputSchema = Yup.object().shape({
  rubricId,
  productId,
});