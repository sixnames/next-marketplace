import * as Yup from 'yup';
import { color, id, langInput, notNullableName } from './templates';
import { GENDER_ENUMS } from '../config';

export const optionVariant = Yup.object().shape({
  key: Yup.mixed().oneOf(GENDER_ENUMS).required('Род опции обязателен к заполнению.'),
  value: langInput(notNullableName('Значение рода опции')),
});

export const optionInGroupCommonSchema = {
  name: langInput(notNullableName('Название опции')),
  color,
  variants: Yup.array().of(optionVariant),
  gender: Yup.mixed()
    .oneOf(GENDER_ENUMS)
    .nullable()
    .when('variants', {
      is: (variants: any[]) => {
        return !variants || !variants.length;
      },
      then: Yup.mixed().oneOf(GENDER_ENUMS).required('Род опции обязателен к заполнению.'),
      otherwise: Yup.mixed().oneOf(GENDER_ENUMS).nullable(),
    }),
};

export const optionInGroupSchema = Yup.object().shape({
  ...optionInGroupCommonSchema,
});

export const addOptionToGroupSchema = Yup.object().shape({
  groupId: id,
  ...optionInGroupCommonSchema,
});

export const updateOptionInGroupSchema = Yup.object().shape({
  groupId: id,
  optionId: id,
  ...optionInGroupCommonSchema,
});

export const deleteOptionFromGroupSchema = Yup.object().shape({
  groupId: id,
  optionId: id,
});
