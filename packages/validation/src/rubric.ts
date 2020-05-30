import * as Yup from 'yup';
import { name, id } from './templates';

const parent = Yup.string().nullable();
const variant = Yup.string().when('parent', {
  is: (val) => val,
  then: Yup.string().nullable(),
  otherwise: Yup.string().required('Типа рубрики обязателен к заполнению.'),
});

const rubricId = Yup.string().nullable().required('ID рубрики обязательно к заполнению.');
const attributesGroupId = Yup.string()
  .nullable()
  .required('ID группы атрибутов обязательно к заполнению.');

export const createRubricInputSchema = Yup.object().shape({
  name,
  catalogueName: name,
  parent,
  variant,
});

export const updateRubricInputSchema = Yup.object().shape({
  id,
  name,
  catalogueName: name,
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
