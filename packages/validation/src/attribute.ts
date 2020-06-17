import * as Yup from 'yup';
import { id, langInput, notNullableName } from './templates';
import {
  ATTRIBUTE_TYPES_ENUMS,
  ATTRIBUTE_TYPE_SELECT,
  ATTRIBUTE_TYPE_MULTIPLE_SELECT,
} from '@rg/config';

const options = Yup.string()
  .nullable()
  .when('variant', {
    is: (variant) => {
      return variant === ATTRIBUTE_TYPE_SELECT || variant === ATTRIBUTE_TYPE_MULTIPLE_SELECT;
    },
    then: Yup.string().required('Группа опций обязательна к заполнению.'),
    otherwise: Yup.string(),
  });

const metric = Yup.string().nullable();

const attributeCommonFields = {
  name: langInput(notNullableName('Название атрибута')),
  variant: Yup.mixed()
    .oneOf(ATTRIBUTE_TYPES_ENUMS)
    .required('Тип атрибута обязателен к заполнению.'),
  metric,
  options,
};

export const attributeInGroupSchema = Yup.object().shape({
  ...attributeCommonFields,
});

export const addAttributeToGroupSchema = Yup.object().shape({
  groupId: id,
  ...attributeCommonFields,
});

export const updateAttributeInGroupSchema = Yup.object().shape({
  groupId: id,
  attributeId: id,
  ...attributeCommonFields,
});

export const deleteAttributeFromGroupSchema = Yup.object().shape({
  groupId: id,
  attributeId: id,
});
