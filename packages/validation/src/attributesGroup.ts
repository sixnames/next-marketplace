import * as Yup from 'yup';
import { id, langInput, notNullableName } from './templates';

export const createAttributesGroupSchema = Yup.object().shape({
  name: langInput(notNullableName('Название группы атрибутов')),
});

export const updateAttributesGroupSchema = Yup.object().shape({
  id,
  name: langInput(notNullableName('Название группы атрибутов')),
});
