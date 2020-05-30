import * as Yup from 'yup';
import { name, id } from './templates';
import {
  ATTRIBUTE_TYPES_ENUMS,
  ATTRIBUTE_TYPE_SELECT,
  ATTRIBUTE_TYPE_MULTIPLE_SELECT,
} from '@rg/config';

const options = Yup.string()
  .nullable()
  .when('type', {
    is: (type) => type === ATTRIBUTE_TYPE_SELECT || type === ATTRIBUTE_TYPE_MULTIPLE_SELECT,
    then: Yup.string().required('Группа опций обязательна к заполнению.'),
    otherwise: Yup.string(),
  });

const metric = Yup.string().nullable();

const attributeCommonFields = {
  name,
  type: Yup.mixed().oneOf(ATTRIBUTE_TYPES_ENUMS).required('Тип атрибута обязателен к заполнению.'),
  metric,
  options,
};

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
