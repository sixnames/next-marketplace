import * as Yup from 'yup';
import { color, id, langInput, notNullableName } from './templates';

export const optionInGroupCommonSchema = {
  name: langInput(notNullableName('Название опции')),
  color,
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
