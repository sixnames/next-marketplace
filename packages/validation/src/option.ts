import * as Yup from 'yup';
import { color, id, langInput, notNullableName } from './templates';

export const addOptionToGroupSchema = Yup.object().shape({
  groupId: id,
  name: langInput(notNullableName('Название опции')),
  color,
});

export const updateOptionInGroupSchema = Yup.object().shape({
  groupId: id,
  optionId: id,
  name: langInput(notNullableName('Название опции')),
  color,
});

export const deleteOptionFromGroupSchema = Yup.object().shape({
  groupId: id,
  optionId: id,
});
