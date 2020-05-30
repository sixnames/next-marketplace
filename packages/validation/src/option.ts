import * as Yup from 'yup';
import { name, color, id } from './templates';

export const addOptionToGroupSchema = Yup.object().shape({
  groupId: id,
  name,
  color,
});

export const updateOptionInGroupSchema = Yup.object().shape({
  groupId: id,
  optionId: id,
  name,
  color,
});

export const deleteOptionFromGroupSchema = Yup.object().shape({
  groupId: id,
  optionId: id,
});
