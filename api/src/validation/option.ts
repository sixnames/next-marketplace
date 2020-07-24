import * as Yup from 'yup';
import { color, id, langStringInputSchema } from './templates';
import { GENDER_ENUMS } from '../config';

export const optionVariant = (defaultLang: string) =>
  Yup.object().shape({
    key: Yup.mixed().oneOf(GENDER_ENUMS).required('Род опции обязателен к заполнению.'),
    value: langStringInputSchema({ defaultLang, entityMessage: 'Значение рода опции' }),
  });

export const optionInGroupCommonSchema = (defaultLang: string) => ({
  name: langStringInputSchema({ defaultLang, entityMessage: 'Название опции' }),
  color,
  variants: Yup.array().of(optionVariant(defaultLang)),
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
});

export const optionInGroupSchema = (defaultLang: string) =>
  Yup.object().shape({
    ...optionInGroupCommonSchema(defaultLang),
  });

export const addOptionToGroupSchema = (defaultLang: string) =>
  Yup.object().shape({
    groupId: id,
    ...optionInGroupCommonSchema(defaultLang),
  });

export const updateOptionInGroupSchema = (defaultLang: string) =>
  Yup.object().shape({
    groupId: id,
    optionId: id,
    ...optionInGroupCommonSchema(defaultLang),
  });

export const deleteOptionFromGroupSchema = Yup.object().shape({
  groupId: id,
  optionId: id,
});
