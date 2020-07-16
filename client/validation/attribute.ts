import * as Yup from 'yup';
import { langInput, notNullableName } from './templates';
import {
  ATTRIBUTE_POSITION_IN_TITLE_ENUMS,
  ATTRIBUTE_TYPE_MULTIPLE_SELECT,
  ATTRIBUTE_TYPE_SELECT,
  ATTRIBUTE_TYPES_ENUMS,
} from '../config';

const options = Yup.string()
  .nullable()
  .when('variant', {
    is: (variant: string) => {
      return variant === ATTRIBUTE_TYPE_SELECT || variant === ATTRIBUTE_TYPE_MULTIPLE_SELECT;
    },
    then: Yup.string().required('Группа опций обязательна к заполнению.'),
    otherwise: Yup.string(),
  });

const metric = Yup.string().nullable();

const attributePositioningInTitle = Yup.object().shape({
  key: Yup.string().required(),
  value: Yup.mixed()
    .oneOf(ATTRIBUTE_POSITION_IN_TITLE_ENUMS)
    .required('Позиционирование атрибута в заголовке каталога обязательно к заполнению.'),
});

const attributeCommonFields = {
  name: langInput(notNullableName('Название атрибута')),
  variant: Yup.mixed()
    .oneOf(ATTRIBUTE_TYPES_ENUMS)
    .required('Тип атрибута обязателен к заполнению.'),
  metric,
  options,
  positioningInTitle: Yup.array().of(attributePositioningInTitle).required(),
};

export const attributeInGroupSchema = Yup.object().shape({
  ...attributeCommonFields,
});
